"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";

const Saidas = () => {
  const [totalSaidas, setTotalSaidas] = useState<number | null>(null);

  useEffect(() => {
    const fetchSaidas = async () => {
      try {
        const response = await fetch("/api/saidas");
        const data = await response.json();

        console.log("Dados retornados da API:", data); // Depuração para verificar os dados

        if (Array.isArray(data) && data.length > 0) {
          // Soma o valor das saídas
          const total = data.reduce(
            (acc: number, entry: { valor: string | number }) => {
              const valorNumerico =
                typeof entry.valor === "string"
                  ? parseFloat(entry.valor)
                  : entry.valor;
              return acc + (isNaN(valorNumerico) ? 0 : valorNumerico);
            },
            0
          );

          console.log("Total de saídas calculado:", total); // Depuração do total

          setTotalSaidas(total);
        } else {
          setTotalSaidas(0); // Se não houver saídas, define como 0
        }
      } catch (error) {
        console.error("Erro ao buscar saídas:", error);
        setTotalSaidas(0); // Se ocorrer um erro, define como 0
      }
    };

    fetchSaidas();
  }, []);

  return (
    <div className="bg-red-100 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-red-700">Saídas</h3>
      <p className="text-2xl mt-4 text-red-600">
        {totalSaidas !== null
          ? `R$ ${totalSaidas.toFixed(2).replace(".", ",")}`
          : "Carregando..."}
      </p>
    </div>
  );
};

export default Saidas;
