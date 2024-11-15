import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de importar sua configuração MySQL

// Função para buscar as saídas
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT SUM(COALESCE(valor, 0)) AS totalSaidas FROM saidas"
      );

      // Verificar se a resposta é válida
      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "Nenhuma saída encontrada" });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar saídas" });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
