"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/Sidebar";

// Tipagem das respostas das APIs
interface Entrada {
  totalEntradas: number;
}

interface Saida {
  totalSaidas: number;
}

interface Membro {
  id: number;
  nome: string;
}

interface Usuario {
  id: number;
  nome: string;
}

interface ContaAPagar {
  id: number;
  nome_conta: string;
  valor: number;
  status: string;
  data_vencimento: string;
}

const Dashboard = () => {
  const [entradasData, setEntradasData] = useState<Entrada[]>([]);
  const [saidasData, setSaidasData] = useState<Saida[]>([]);
  const [membrosData, setMembrosData] = useState<Membro[]>([]);
  const [usersData, setUsersData] = useState<Usuario[]>([]);
  const [contasAPagarData, setContasAPagarData] = useState<ContaAPagar[]>([]);

  // Função para buscar os dados de todas as APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const entradasResponse = await fetch("/api/entradas");
        const entradas = await entradasResponse.json();
        if (Array.isArray(entradas) && entradas.length > 0) {
          setEntradasData(entradas);
        }

        const saídasResponse = await fetch("/api/saidas");
        const saídas = await saídasResponse.json();
        if (Array.isArray(saídas) && saídas.length > 0) {
          setSaidasData(saídas);
        }

        const membrosResponse = await fetch("/api/membros");
        const membros = await membrosResponse.json();
        if (Array.isArray(membros) && membros.length > 0) {
          setMembrosData(membros);
        }

        const usersResponse = await fetch("/api/users");
        const users = await usersResponse.json();
        if (Array.isArray(users) && users.length > 0) {
          setUsersData(users);
        }

        const contasResponse = await fetch("/api/contasapagar");
        const contas = await contasResponse.json();
        if (Array.isArray(contas) && contas.length > 0) {
          setContasAPagarData(contas);
        }
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    };

    fetchData();
  }, []);

  // Função para formatar valores em R$
  const formatarValor = (valor: number | string) => {
    const numero =
      typeof valor === "number" ? valor : parseFloat(valor as string);
    if (isNaN(numero)) {
      return "Valor inválido"; // Retorna uma mensagem caso o valor não seja numérico
    }
    return `R$ ${numero.toFixed(2).replace(".", ",")}`;
  };

  // Função para contar o número de membros e usuários
  const contarMembros = membrosData.length || 0;
  const contarUsuarios = usersData.length || 0;

  // Função para formatar a data no formato DD/MM/YYYY
  const formatarData = (data: string) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Garantir que os dados estão disponíveis antes de acessá-los
  const totalEntradas = entradasData?.[0]?.totalEntradas || 0;
  const totalSaidas = saidasData?.[0]?.totalSaidas || 0;

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saldo Atual */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700">Saldo Atual</h3>
            <p className="text-2xl mt-4 text-blue-600">
              {formatarValor(totalEntradas - totalSaidas)}
            </p>
          </div>

          {/* Entradas e Saídas */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700">Entradas</h3>
            <p className="text-2xl mt-4 text-green-600">
              {formatarValor(totalEntradas)}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700">Saídas</h3>
            <p className="text-2xl mt-4 text-red-600">
              {formatarValor(totalSaidas)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Membros e Usuários */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-yellow-700">
              Membros Cadastrados
            </h3>
            <p className="text-2xl mt-4 text-yellow-600">{contarMembros}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-purple-700">
              Usuários Ativos
            </h3>
            <p className="text-2xl mt-4 text-purple-600">{contarUsuarios}</p>
          </div>
        </div>

        {/* Contas a Pagar */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-gray-700">
            Resumo de Contas
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-600">
                    Nome da Conta
                  </th>
                  <th className="py-2 px-4 border-b text-gray-600">Valor</th>
                  <th className="py-2 px-4 border-b text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-gray-600">
                    Data de Vencimento
                  </th>
                </tr>
              </thead>
              <tbody>
                {contasAPagarData?.map((conta: ContaAPagar) => (
                  <tr key={conta.id}>
                    <td className="py-2 px-4 border-b text-gray-800">
                      {conta.nome_conta || "Nome da conta não disponível"}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-800">
                      {formatarValor(conta.valor)}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-800">
                      {conta.status}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-800">
                      {formatarData(conta.data_vencimento)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
