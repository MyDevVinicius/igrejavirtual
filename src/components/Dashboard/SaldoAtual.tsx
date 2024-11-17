"use client"; // Adicionando a diretiva de cliente

import React, { useEffect, useState } from "react";

const SaldoAtual = () => {
  const [totalEntradas, setTotalEntradas] = useState<number | null>(null);
  const [totalSaidas, setTotalSaidas] = useState<number | null>(null);

  // Função para buscar entradas
  const fetchEntradas = async () => {
    try {
      const response = await fetch("/api/entradas");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
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
        setTotalEntradas(total);
      } else {
        setTotalEntradas(0); // Se não houver entradas, define como 0
      }
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
      setTotalEntradas(0);
    }
  };

  // Função para buscar saídas
  const fetchSaidas = async () => {
    try {
      const response = await fetch("/api/saidas");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
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
        setTotalSaidas(total);
      } else {
        setTotalSaidas(0); // Se não houver saídas, define como 0
      }
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      setTotalSaidas(0);
    }
  };

  useEffect(() => {
    fetchEntradas();
    fetchSaidas();
  }, []);

  // Calculando o saldo
  const saldoAtual =
    totalEntradas !== null && totalSaidas !== null
      ? totalEntradas - totalSaidas
      : null;

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-blue-700">Saldo Atual</h3>
      <p className="text-2xl mt-4 text-blue-600">
        {saldoAtual !== null
          ? `R$ ${saldoAtual.toFixed(2).replace(".", ",")}`
          : "Carregando..."}
      </p>
    </div>
  );
};

export default SaldoAtual;
