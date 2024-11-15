import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Extrair o cookie da requisição
      const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};
      const userEmail = cookies.userEmail;

      console.log("Cookies recebidos:", cookies);
      console.log("Email do usuário a partir do cookie:", userEmail);

      if (!userEmail) {
        console.log(
          "Usuário não autenticado: Cookie userEmail não encontrado."
        );
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      // Consultar usuário no banco de dados usando o email do cookie
      const [rows]: any[] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [userEmail]
      );

      console.log("Resultado da consulta ao banco de dados:", rows);

      if (rows.length === 0) {
        console.log("Usuário não encontrado no banco de dados.");
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const user = rows[0];
      console.log("Nome do usuário encontrado:", user.name);

      // Retornar informações do usuário
      return res.status(200).json({ nome: user.name, cargo: user.cargo });
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar informações do usuário" });
    }
  } else {
    // Retornar erro se o método não for GET
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
