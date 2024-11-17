import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de que o caminho está correto

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute("SELECT valor FROM entradas");

      console.log("Dados retornados da consulta:", rows); // Depuração para verificar os dados

      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "Nenhuma entrada encontrada" });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar entradas" });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
