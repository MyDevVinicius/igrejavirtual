import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  cargo: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
      const [rows]: any[] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const user: User = rows[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        // Criando o cookie para o email
        res.setHeader(
          "Set-Cookie",
          serialize("userEmail", String(user.email), {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // Expira em 7 dias
            httpOnly: true, // Não pode ser acessado via JavaScript
            secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
            sameSite: "lax", // Prevenir CSRF
          })
        );

        // Opcionalmente, podemos também salvar o nome do usuário no localStorage do frontend
        // Retornar o nome do usuário para a resposta, caso o frontend precise dele
        return res
          .status(200)
          .json({ message: "Login realizado com sucesso", nome: user.name });
      } else {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ error: "Erro interno ao fazer login" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
