"use client";

import React, { useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa6";

interface UsuariosAtivosProps {
  width?: string;
  height?: string;
}

const UsuariosAtivos: React.FC<UsuariosAtivosProps> = ({
  width = "15rem",
  height = "8rem",
}) => {
  const [quantidade, setQuantidade] = useState<number>(0);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const fetchQuantidadeUsuariosAtivos = async () => {
      try {
        // Verificando se a chave e o nome do banco estão no localStorage
        const chave = localStorage.getItem("codigo_verificacao");
        const nomeBanco = localStorage.getItem("nome_banco");

        // Se algum valor não for encontrado, dispara erro
        if (!chave || !nomeBanco) {
          throw new Error(
            "Chave de verificação ou nome do banco não encontrados."
          );
        }

        console.log("Chave:", chave);
        console.log("Nome do banco:", nomeBanco);

        // Realizando a requisição à API
        const response = await fetch("/api/users", {
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

        // Atualizando a quantidade de usuários ativos
        setQuantidade(data.quantidade || 0);
      } catch (error: any) {
        console.error(
          "Erro ao buscar quantidade de usuários ativos:",
          error.message
        );
        // Definindo o erro no estado
        setErro(error.message || "Erro ao carregar os dados.");
      }
    };

    fetchQuantidadeUsuariosAtivos();
  }, []); // Executa apenas uma vez quando o componente é montado

  return (
    <div
      className="bg-orange-100 p-4 rounded-lg shadow-md"
      style={{ width, height }}
    >
      <h3 className="text-lg sm:text-xl font-semibold text-orange-700 flex items-center">
        <FaUserShield className="w-8 h-8 mr-2" /> Usuários Ativos
      </h3>
      <p className="text-base sm:text-2xl mt-2 sm:mt-4 text-orange-600">
        {erro ? erro : quantidade}
      </p>
    </div>
  );
};

export default UsuariosAtivos;
