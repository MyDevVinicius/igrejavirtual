"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";

const Entradas = () => {
  const [totalEntradas, setTotalEntradas] = useState<number | null>(null);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const response = await fetch("/api/entradas");
        const data = await response.json();

        console.log("Dados retornados da API:", data); // Depuração para verificar os dados

        if (Array.isArray(data) && data.length > 0) {
          // Verifica se o campo valor é um número e soma
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

          console.log("Total de entradas calculado:", total); // Depuração do total

          setTotalEntradas(total);
        } else {
          setTotalEntradas(0); // Se não houver entradas, define como 0
        }
      } catch (error) {
        console.error("Erro ao buscar entradas:", error);
        setTotalEntradas(0); // Se ocorrer um erro, define como 0
      }
    };

    fetchEntradas();
  }, []);

  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-green-700">Entradas</h3>
      <p className="text-2xl mt-4 text-green-600">
        {totalEntradas !== null
          ? `R$ ${totalEntradas.toFixed(2).replace(".", ",")}`
          : "Carregando..."}
      </p>
    </div>
  );
};

export default Entradas;
