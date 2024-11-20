"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa"; // Ícone da carteira

interface SaldoAtualProps {
  width?: string; // Largura personalizada
  height?: string; // Altura personalizada
}

interface EntradasSaidas {
  valor: number;
}

const SaldoAtual: React.FC<SaldoAtualProps> = ({
  width = "15rem", // Largura padrão para telas menores
  height = "8rem", // Altura padrão para telas menores
}) => {
  const [saldo, setSaldo] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recupera a chave de verificação e nome do banco do localStorage
    const chave = localStorage.getItem("codigo_verificacao");
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!chave || !nomeBanco) {
      setError("Chave de verificação ou nome do banco não encontrados.");
      return;
    }

    // Função para buscar as entradas e saídas da API
    const fetchSaldo = async () => {
      try {
        const [entradasResponse, saidasResponse] = await Promise.all([
          fetch("/api/entradas", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-verificacao-chave": chave, // Passa a chave de verificação
              "x-nome-banco": nomeBanco, // Passa o nome do banco
            },
          }),
          fetch("/api/saidas", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-verificacao-chave": chave, // Passa a chave de verificação
              "x-nome-banco": nomeBanco, // Passa o nome do banco
            },
          }),
        ]);

        if (!entradasResponse.ok || !saidasResponse.ok) {
          throw new Error("Erro ao buscar entradas ou saídas.");
        }

        const entradas: EntradasSaidas[] = await entradasResponse.json();
        const saidas: EntradasSaidas[] = await saidasResponse.json();

        // Calcular o saldo
        const totalEntradas = entradas.reduce(
          (acc: number, entrada: EntradasSaidas) =>
            acc + parseFloat(entrada.valor.toString()),
          0
        );
        const totalSaidas = saidas.reduce(
          (acc: number, saida: EntradasSaidas) =>
            acc + parseFloat(saida.valor.toString()),
          0
        );

        setSaldo(totalEntradas - totalSaidas); // Atualiza o estado com o saldo total
      } catch (error: any) {
        setError("Erro ao buscar saldo: " + error.message);
      }
    };

    fetchSaldo();
  }, []); // Só executa na montagem do componente

  return (
    <div
      className="bg-blue-100 p-4 rounded-lg shadow-md"
      style={{ width, height }} // Aplica a largura e altura passadas como props
    >
      <h3 className="text-lg sm:text-xl font-semibold text-blue-700 flex items-center">
        <FaWallet className="w-8 h-8 mr-2" /> Saldo Atual
      </h3>
      <p className="text-base sm:text-2xl mt-2 sm:mt-4 text-blue-600">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          `R$ ${saldo.toFixed(2).replace(".", ",")}`
        )}
      </p>
    </div>
  );
};

export default SaldoAtual;
