"use client";
import React, { useEffect, useState } from "react";

interface ContaAPagar {
  id: number;
  nome_conta: string;
  valor: string;
  data_vencimento: string;
  status: string;
  data_pagamento?: string | null;
}

const ContasAPagarList: React.FC = () => {
  const [contas, setContas] = useState<ContaAPagar[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchContas = async () => {
    try {
      const chave = localStorage.getItem("codigo_verificacao");
      const nomeBanco = localStorage.getItem("nome_banco");

      if (!chave || !nomeBanco) {
        setError("Chave de verificação ou nome do banco não encontrados.");
        return;
      }

      const response = await fetch("/api/contasapagar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-verificacao-chave": chave,
          "x-nome-banco": nomeBanco,
        },
      });

      const data = await response.json();
      if (data.message === "Sucesso") {
        setContas(data.data);
      } else {
        console.error("Erro ao carregar contas", data.message);
        setError("Erro ao carregar contas");
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      setError("Erro ao buscar contas");
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const formatarValor = (valor: number | string) => {
    const numero =
      typeof valor === "number" ? valor : parseFloat(valor as string);
    return `R$ ${numero.toFixed(2).replace(".", ",")}`;
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const isVencido = (dataVencimento: string, status: string) => {
    const today = new Date();
    const vencimento = new Date(dataVencimento);
    return status !== "Pago" && vencimento < today;
  };

  const isPagoParcial = (dataVencimento: string, status: string) => {
    const today = new Date();
    const vencimento = new Date(dataVencimento);
    return status === "Pago Parcial" && vencimento >= today;
  };

  const contasFiltradas = contas
    .filter((conta) => {
      const vencimento = new Date(conta.data_vencimento);
      const startDate = startDateFilter ? new Date(startDateFilter) : null;
      const endDate = endDateFilter ? new Date(endDateFilter) : null;

      const matchesStatus =
        statusFilter === "Todos" ||
        (statusFilter === "Vencido" &&
          isVencido(conta.data_vencimento, conta.status)) ||
        (statusFilter === "Pago Parcial" &&
          isPagoParcial(conta.data_vencimento, conta.status)) ||
        conta.status === statusFilter;

      const matchesDate =
        (!startDate || vencimento >= startDate) &&
        (!endDate || vencimento <= endDate);

      return matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const dataA = new Date(a.data_vencimento).getTime();
      const dataB = new Date(b.data_vencimento).getTime();
      return dataA - dataB;
    });

  const getStatusClasses = (
    status: string,
    vencido: boolean,
    pagoParcial: boolean
  ) => {
    if (pagoParcial) return "bg-purple-200 text-purple-900 font-bold";
    if (vencido) return "bg-red-200 text-red-900 font-bold";
    switch (status) {
      case "Pago":
        return "bg-green-200 text-green-900 font-bold";
      case "Pendente":
        return "bg-orange-200 text-orange-900 font-bold";
      default:
        return "bg-gray-200 text-gray-900 font-bold";
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-semibold">
            Filtrar por status:
          </label>
          <select
            id="statusFilter"
            className="p-2 border border-gray-300 font-bold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Vencido">Vencido</option>
            <option value="Pago">Pago</option>
            <option value="Pago Parcial">Pago Parcial</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDateFilter" className="mr-2 font-semibold">
            Data início:
          </label>
          <input
            type="date"
            id="startDateFilter"
            className="p-2 border border-gray-300 font-bold"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDateFilter" className="mr-2 font-semibold">
            Data fim:
          </label>
          <input
            type="date"
            id="endDateFilter"
            className="p-2 border border-gray-300 font-bold"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Adicionando scroll horizontal para telas menores */}
      <div className="overflow-x-auto max-h-[360px]">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-2 text-left font-bold">Conta</th>
              <th className="p-2 text-left font-bold">Valor</th>
              <th className="p-2 text-left font-bold">Vencimento</th>
              <th className="p-2 text-left font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {contasFiltradas.map((conta) => {
              const vencido = isVencido(conta.data_vencimento, conta.status);
              const pagoParcial = isPagoParcial(
                conta.data_vencimento,
                conta.status
              );
              return (
                <tr
                  key={conta.id}
                  className={`border-b-2 ${getStatusClasses(
                    conta.status,
                    vencido,
                    pagoParcial
                  )}`}
                >
                  <td className="p-2 font-bold">{conta.nome_conta}</td>
                  <td className="p-2 font-bold">
                    {formatarValor(conta.valor)}
                  </td>
                  <td className="p-2 font-bold">
                    {formatarData(conta.data_vencimento)}
                  </td>
                  <td className="p-2 font-bold">{conta.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContasAPagarList;
