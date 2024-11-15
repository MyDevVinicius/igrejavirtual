import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password, cargo } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (name, email, password, cargo) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, cargo]
      );
      res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
