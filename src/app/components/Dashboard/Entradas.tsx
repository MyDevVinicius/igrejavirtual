"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md"; // Ícone verde

interface EntradasProps {
  width?: string; // Largura personalizada
  height?: string; // Altura personalizada
}

const Entradas: React.FC<EntradasProps> = ({
  width = "15rem", // Largura padrão para telas menores
  height = "8rem", // Altura padrão para telas menores
}) => {
  const [somaEntradas, setSomaEntradas] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recupera a chave de verificação e nome do banco do localStorage
    const chave = localStorage.getItem("codigo_verificacao");
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!chave || !nomeBanco) {
      setError("Chave de verificação ou nome do banco não encontrados.");
      return;
    }

    // Função para buscar as entradas da API
    const fetchEntradas = async () => {
      try {
        const response = await fetch("/api/entradas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-verificacao-chave": chave, // Passa a chave de verificação
            "x-nome-banco": nomeBanco, // Passa o nome do banco
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar entradas.");
        }

        const data = await response.json();
        console.log("Dados retornados:", data);

        // Calcular a soma dos valores das entradas
        const soma = data.reduce(
          (acc: number, entrada: any) => acc + parseFloat(entrada.valor),
          0
        );
        setSomaEntradas(soma); // Atualiza o estado com a soma total
      } catch (error) {
        setError("Erro ao buscar entradas: " + error.message);
      }
    };

    fetchEntradas();
  }, []); // Só executa na montagem do componente

  return (
    <div
      className="bg-green-100 p-4 rounded-lg shadow-md"
      style={{ width, height }} // Aplica a largura e altura passadas como props
    >
      <h3 className="text-lg sm:text-xl font-semibold text-green-700 flex items-center">
        <MdOutlineAttachMoney className="w-8 h-8 mr-2" /> Entradas
      </h3>
      <p className="text-base sm:text-2xl mt-2 sm:mt-4 text-green-600">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          `R$ ${somaEntradas.toFixed(2).replace(".", ",")}`
        )}
      </p>
    </div>
  );
};

export default Entradas;
