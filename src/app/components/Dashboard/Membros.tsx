"use client";

import React, { useEffect, useState } from "react";
import { PiUsersThreeFill } from "react-icons/pi";

interface MembrosProps {
  width?: string; // Largura personalizada
  height?: string; // Altura personalizada
}

const Membros: React.FC<MembrosProps> = ({
  width = "15rem", // Largura padrão para telas menores
  height = "8rem", // Altura padrão para telas menores
}) => {
  const [quantidade, setQuantidade] = useState<number>(0);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const fetchQuantidadeMembros = async () => {
      try {
        const chave = localStorage.getItem("codigo_verificacao");
        const nomeBanco = localStorage.getItem("nome_banco");

        if (!chave || !nomeBanco) {
          throw new Error(
            "Chave de verificação ou nome do banco não encontrados."
          );
        }

        console.log("Chave:", chave);
        console.log("Nome do banco:", nomeBanco);

        // Requisição com cabeçalhos
        const response = await fetch("/api/membros", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-verificacao-chave": chave,
            "x-nome-banco": nomeBanco,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar os dados: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        setQuantidade(data.quantidade || 0);
      } catch (error: any) {
        console.error("Erro ao buscar quantidade de membros:", error.message);
        setErro(error.message || "Erro ao carregar os dados.");
      }
    };

    fetchQuantidadeMembros();
  }, []);

  return (
    <div
      className="bg-purple-100 p-4 rounded-lg shadow-md"
      style={{ width, height }} // Aplica a largura e altura passadas como props
    >
      <h3 className="text-lg sm:text-xl font-semibold text-purple-700 flex items-center">
        <PiUsersThreeFill className="w-8 h-8 mr-2" /> Membros
      </h3>
      <p className="text-base sm:text-2xl mt-2 sm:mt-4 text-purple-800">
        {erro || quantidade}
      </p>
    </div>
  );
};

export default Membros;
