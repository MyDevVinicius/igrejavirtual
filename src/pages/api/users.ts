import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      console.log("GET request iniciado");

      // Contagem de usuários ativos
      const [rows]: [any[], any] = await pool.execute(
        "SELECT COUNT(*) AS ativo_count FROM users WHERE ativo = 1"
      );

      console.log("Resultado da consulta:", rows);

      if (rows.length > 0) {
        return res.status(200).json({ quantidade: rows[0].ativo_count });
      } else {
        return res
          .status(404)
          .json({ message: "Nenhum usuário ativo encontrado." });
      }
    } else {
      console.log("Método não permitido:", req.method);
      return res.status(405).json({ message: "Método não permitido." });
    }
  } catch (error) {
    console.error("Erro no handler:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
