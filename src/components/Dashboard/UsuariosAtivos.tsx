"use client";

import React, { useEffect, useState } from "react";

const UsuariosAtivos = () => {
  const [quantidade, setQuantidade] = useState<number>(0); // Valor inicial 0
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const fetchQuantidadeUsuariosAtivos = async () => {
      try {
        const response = await fetch("/api/users"); // Chama a API 'users.ts'

        // Verificar se a resposta é válida antes de chamar o JSON
        if (!response.ok) {
          throw new Error("Erro ao carregar os dados.");
        }

        const data = await response.json(); // Parseia a resposta como JSON

        console.log("Resposta da API:", data); // Log da resposta para debug

        // Se houver algum valor de quantidade na resposta, usamos, caso contrário, fica 0
        setQuantidade(data.quantidade || 0);
      } catch (error) {
        console.error("Erro ao buscar quantidade de usuários ativos:", error);
        setErro("Erro ao carregar a quantidade de usuários ativos.");
        setQuantidade(0); // Se houver erro, o valor será 0
      }
    };

    fetchQuantidadeUsuariosAtivos();
  }, []);

  return (
    <div className="bg-indigo-100 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-indigo-700">Usuários Ativos</h3>
      <p className="text-2xl mt-4 text-indigo-600">{erro || quantidade}</p>{" "}
      {/* Exibe erro ou a quantidade de usuários ativos */}
    </div>
  );
};

export default UsuariosAtivos;
