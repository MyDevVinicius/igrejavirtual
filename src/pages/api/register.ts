import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { getAdminConnection, getClientConnection } from "../../lib/db"; // Certifique-se de ajustar o caminho para o arquivo db.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password, cargo, chave } = req.body;

    // Verificar se a chave de verificação foi fornecida
    if (!chave) {
      return res
        .status(400)
        .json({ error: "Chave de verificação é obrigatória" });
    }

    try {
      // Obtém a conexão do banco admin_db para verificar a chave de verificação
      const adminConnection = await getAdminConnection();

      // Verifica a chave e obtém o nome do banco associado
      const [rows] = await adminConnection.query(
        "SELECT nome_banco FROM clientes WHERE codigo_verificacao = ?",
        [chave]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Chave inválida" });
      }

      const databaseName = rows[0].nome_banco;

      // Agora que temos o nome do banco do cliente, obtemos a conexão com o banco do cliente
      const clientConnection = await getClientConnection(databaseName);

      // Criptografa a senha do usuário
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere o usuário no banco específico do cliente
      await clientConnection.query(
        "INSERT INTO users (name, email, password, cargo) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, cargo]
      );

      return res
        .status(201)
        .json({ message: "Usuário registrado com sucesso" });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
