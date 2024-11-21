"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ContaAPagar {
  id: number;
  observacao: string;
  valor: string;
  data_vencimento: string;
  status: string;
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
      if (!chave) {
        setError("Chave de verificação não encontrada.");
        toast.error("Chave de verificação não encontrada.");
        return;
      }

      const response = await fetch(`/api/contasapagar?chave=${chave}`);
      const data = await response.json();

      if (response.ok) {
        setContas(data.data);
        toast.success("Contas carregadas com sucesso!");
      } else {
        setError(data.message || "Erro ao carregar contas.");
        toast.error(data.message || "Erro ao carregar contas.");
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      setError("Erro ao buscar contas");
      toast.error("Erro ao buscar contas");
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const formatarValor = (valor: string) =>
    `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-200 text-green-900 font-bold";
      case "Pendente":
        return "bg-orange-200 text-orange-900 font-bold";
      case "Pago Parcial":
        return "bg-purple-200 text-purple-900 font-bold";
      case "Vencida":
        return "bg-red-200 text-red-900 font-bold";
      default:
        return "bg-gray-200 text-gray-900 font-bold";
    }
  };

  const contasFiltradas = contas.filter((conta) => {
    const dataVencimento = new Date(conta.data_vencimento);
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;
    const today = new Date();

    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Vencida" &&
        conta.status === "Pendente" &&
        dataVencimento < today) ||
      statusFilter === conta.status;

    const matchesStartDate = !startDate || dataVencimento >= startDate;
    const matchesEndDate = !endDate || dataVencimento <= endDate;

    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  return (
    <div>
      <ToastContainer />
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="statusFilter" className="font-semibold mr-2">
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2"
          >
            <option value="Todos">Todos</option>
            <option value="Vencida">Vencida</option>
            <option value="Pago">Pago</option>
            <option value="Pago Parcial">Pago Parcial</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDateFilter" className="font-semibold mr-2">
            Data Início:
          </label>
          <input
            type="date"
            id="startDateFilter"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="border p-2"
          />
        </div>
        <div>
          <label htmlFor="endDateFilter" className="font-semibold mr-2">
            Data Fim:
          </label>
          <input
            type="date"
            id="endDateFilter"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="border p-2"
          />
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Observação</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Vencimento</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {contasFiltradas.map((conta) => (
            <tr
              key={conta.id}
              className={`border ${getStatusClasses(conta.status)}`}
            >
              <td className="p-2 text-justify">{conta.observacao}</td>
              <td className="p-2 text-center">{formatarValor(conta.valor)}</td>
              <td className="p-2 text-center">
                {formatarData(conta.data_vencimento)}
              </td>
              <td className="p-2 text-center">{conta.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContasAPagarList;
