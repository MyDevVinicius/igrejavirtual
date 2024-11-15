import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de que o caminho para o `db.ts` está correto

// Função para obter os membros
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute("SELECT * FROM membros"); // Exemplo de query, ajuste conforme sua necessidade

      // Verificar se a resposta contém dados
      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "Nenhum membro encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar dados dos membros:", error);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar membros" });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
