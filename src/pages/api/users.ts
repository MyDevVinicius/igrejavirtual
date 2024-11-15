import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { pool } from "../../db"; // Caminho correto para o db.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Caso o método seja GET
  if (req.method === "GET") {
    try {
      const [rows] = await pool.execute(
        "SELECT id, name AS nome, email, cargo, ativo FROM users"
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ message: "Nenhum usuário encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar usuários" });
    }
  }

  // Caso o método seja POST (Adicionar usuário)
  else if (req.method === "POST") {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha || !cargo) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      // Criptografar a senha antes de armazenar no banco de dados
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Inserção do novo usuário no banco de dados com a senha criptografada
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, cargo) VALUES (?, ?, ?, ?)`,
        [nome, email, hashedPassword, cargo]
      );

      return res.status(201).json({
        id: result.insertId, // ID gerado automaticamente pelo MySQL
        nome,
        email,
        cargo,
      });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      return res.status(500).json({ message: "Erro ao adicionar usuário" });
    }
  }

  // Se o método for diferente de GET ou POST, retorna erro 405
  else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
