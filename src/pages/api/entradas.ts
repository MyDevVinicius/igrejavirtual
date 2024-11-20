import { NextApiRequest, NextApiResponse } from "next";
import { getClientConnection } from "../../lib/db"; // Certifique-se de ajustar o caminho do db.ts
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: `Método ${req.method} não permitido.` });
  }

  // Recupera os cabeçalhos para a chave de verificação e nome do banco
  const chave = req.headers["x-verificacao-chave"];
  const nomeBanco = req.headers["x-nome-banco"];

  if (
    !chave ||
    typeof chave !== "string" ||
    !nomeBanco ||
    typeof nomeBanco !== "string"
  ) {
    return res.status(400).json({
      message: "Chave de verificação ou nome do banco não fornecidos.",
    });
  }

  try {
    // Conecta ao banco admin_db para verificar a chave de verificação
    const adminConnection = await getClientConnection("admin_db");

    // Verifica o nome do banco associado à chave
    const [result] = await adminConnection.query<RowDataPacket[]>(
      "SELECT nome_banco FROM clientes WHERE codigo_verificacao = ?",
      [chave]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Chave inválida." });
    }

    const databaseName = result[0].nome_banco as string;

    // Se o nome do banco passado na requisição não corresponder ao nome do banco verificado
    if (databaseName !== nomeBanco) {
      return res.status(400).json({ message: "Nome do banco inválido." });
    }

    // Conecta ao banco do cliente usando o nome do banco obtido
    const clientConnection = await getClientConnection(databaseName);

    // Consulta para buscar entradas
    const [rows] = await clientConnection.query<RowDataPacket[]>(
      "SELECT * FROM entrada" // Substitua pela consulta real para entradas
    );

    // Libera as conexões
    adminConnection.release();
    clientConnection.release();

    // Retorna os dados de entradas
    return res.status(200).json(rows);
  } catch (error: any) {
    console.error("Erro ao buscar entradas:", error);
    return res.status(500).json({
      message: "Erro interno no servidor.",
    });
  }
}
