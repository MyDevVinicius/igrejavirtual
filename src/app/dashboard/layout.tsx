"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statusCliente, setStatusCliente] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o status do cliente via API
  const fetchClientStatus = async () => {
    const codigoVerificacao = localStorage.getItem("codigo_verificacao"); // Buscar código de verificação do localStorage

    if (!codigoVerificacao) {
      setError("Código de verificação não encontrado.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo_verificacao: codigoVerificacao }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusCliente(data.status); // Recebendo o status do cliente
      } else {
        setError(data.error || "Erro ao verificar status do cliente.");
      }
    } catch (error) {
      console.error("Erro ao buscar status do cliente:", error);
      setError("Erro ao verificar status do cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efetua a busca do status do cliente quando o componente é montado
  useEffect(() => {
    fetchClientStatus();
  }, []);

  if (isLoading) {
    return <div className="text-media font-bold">Carregando...</div>; // Você pode adicionar um spinner de carregamento aqui
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl text-red-500">❌</div>
          <h1 className="text-3xl font-semibold text-red-600">Erro</h1>
          <p className="mt-4 text-xl text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (statusCliente === "inativo") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl text-red-500">❌</div>
          <h1 className="text-3xl font-semibold text-red-600">
            Cliente Bloqueado
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Entre em contato com o suporte para mais informações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo ao lado da sidebar, ajustando margem para 100px e altura */}
      <div className="flex-1 ml-[100px] p-6 pt-1 overflow-hidden h-full">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
