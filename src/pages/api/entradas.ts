// src/pages/api/entradas.ts
import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de que o caminho está correto

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT SUM(COALESCE(valor, 0)) AS totalEntradas FROM entradas"
      );

      // Verifique se o retorno da consulta é válido
      console.log("Dados das entradas:", rows);

      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "Nenhuma entrada encontrada" });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error); // Log de erro completo
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar entradas" });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
