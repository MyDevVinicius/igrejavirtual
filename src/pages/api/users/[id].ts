import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { pool } from "../../../db"; // Caminho correto para o db.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Valide o ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "ID inválido fornecido." });
  }

  // Manipulação dos métodos GET, POST, PUT e DELETE
  switch (req.method) {
    case "GET":
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
    case "POST":
      const { nome, email, senha, cargo } = req.body;
      if (!nome || !email || !senha || !cargo) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }
      try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [result] = await pool.execute(
          `INSERT INTO users (name, email, password, cargo) VALUES (?, ?, ?, ?)`,
          [nome, email, hashedPassword, cargo]
        );
        return res.status(201).json({
          id: result.insertId,
          nome,
          email,
          cargo,
        });
      } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
        return res.status(500).json({ message: "Erro ao adicionar usuário" });
      }
    case "PUT":
      const { senhaAtual, novaSenha } = req.body;
      if (!senhaAtual || !novaSenha) {
        return res
          .status(400)
          .json({ message: "Senha atual e nova senha são obrigatórias." });
      }
      try {
        const [userRows] = await pool.execute(
          "SELECT id, password FROM users WHERE id = ?",
          [id]
        );
        if (!userRows || userRows.length === 0) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }
        const user = userRows[0];
        const isPasswordMatch = await bcrypt.compare(senhaAtual, user.password);
        if (!isPasswordMatch) {
          return res.status(400).json({ message: "Senha atual incorreta." });
        }
        const hashedNewPassword = await bcrypt.hash(novaSenha, 10);
        await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
          hashedNewPassword,
          id,
        ]);
        return res
          .status(200)
          .json({ message: "Senha atualizada com sucesso." });
      } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        return res.status(500).json({ message: "Erro ao atualizar senha." });
      }
    case "DELETE":
      try {
        const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
          id,
        ]);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }
        return res
          .status(200)
          .json({ message: "Usuário deletado com sucesso." });
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({ message: "Erro ao deletar usuário." });
      }
    default:
      return res.status(405).json({ message: "Método não permitido" });
  }
}
