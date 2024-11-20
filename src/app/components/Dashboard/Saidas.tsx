"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md"; // Ícone verde

interface SaidasProps {
  width?: string; // Largura personalizada
  height?: string; // Altura personalizada
}

interface Saidas {
  valor: number;
}

const Saidas: React.FC<SaidasProps> = ({
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
        const response = await fetch("/api/saidas", {
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

        const data: Saidas[] = await response.json();
        console.log("Dados retornados:", data);

        // Calcular a soma dos valores das entradas
        const soma = data.reduce(
          (acc: number, entrada: Saidas) =>
            acc + parseFloat(entrada.valor.toString()),
          0
        );
        setSomaEntradas(soma); // Atualiza o estado com a soma total
      } catch (error: any) {
        setError("Erro ao buscar entradas: " + error.message);
      }
    };

    fetchEntradas();
  }, []); // Só executa na montagem do componente

  return (
    <div
      className="bg-red-100 p-4 rounded-lg shadow-md"
      style={{ width, height }} // Aplica a largura e altura passadas como props
    >
      <h3 className="text-lg sm:text-xl font-semibold text-red-700 flex items-center">
        <MdOutlineAttachMoney className="w-8 h-8 mr-2" /> Saidas
      </h3>
      <p className="text-base sm:text-2xl mt-2 sm:mt-4 text-red-600">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          `R$ ${somaEntradas.toFixed(2).replace(".", ",")}`
        )}
      </p>
    </div>
  );
};

export default Saidas;
