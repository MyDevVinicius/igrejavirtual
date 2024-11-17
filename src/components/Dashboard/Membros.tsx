"use client";

import React, { useEffect, useState } from "react";

const Membros = () => {
  const [quantidade, setQuantidade] = useState<number>(0); // Valor inicial 0

  useEffect(() => {
    const fetchQuantidadeMembros = async () => {
      try {
        const response = await fetch("/api/membros/quantidade"); // API para buscar a quantidade de membros
        const data = await response.json();

        // Se houver algum valor de quantidade na resposta, usamos, caso contrário, fica 0
        setQuantidade(data.quantidade || 0);
      } catch (error) {
        console.error("Erro ao buscar quantidade de membros:", error);
        setQuantidade(0); // Se houver erro, o valor será 0
      }
    };

    fetchQuantidadeMembros();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700">
        Membros Cadastrados
      </h3>
      <p className="text-3xl mt-4 text-gray-800">{quantidade}</p>{" "}
      {/* Exibe 0 caso quantidade seja 0 */}
    </div>
  );
};

export default Membros;
