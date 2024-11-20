import { NextApiRequest, NextApiResponse } from "next";
import { getAdminConnection, getClientConnection } from "../../lib/db"; // Certifique-se de que essas funções estão corretas no seu projeto
import { RowDataPacket } from "mysql2";

interface Cliente extends RowDataPacket {
  nome_banco: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  try {
    const { codigo_verificacao } = req.body;

    // Verifica se o código de verificação foi fornecido
    if (!codigo_verificacao) {
      return res
        .status(400)
        .json({ error: "Código de verificação é necessário" });
    }

    // Conexão com o banco de dados admin para verificar o código de verificação
    const connection = await getAdminConnection();

    const sql = "SELECT nome_banco FROM clientes WHERE codigo_verificacao = ?";
    const [rows] = await connection.execute<Cliente[]>(sql, [
      codigo_verificacao,
    ]);

    // Verifica se o código de verificação existe no banco admin_db
    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const cliente = rows[0];
    const nome_banco = cliente.nome_banco;

    // Verifica se o banco de dados do cliente está associado
    if (!nome_banco) {
      return res
        .status(404)
        .json({ error: "Banco de dados não associado ao cliente" });
    }

    // Conexão com o banco de dados específico do cliente
    const clientConnection = await getClientConnection(nome_banco);

    // Verifique se a conexão foi bem-sucedida
    if (!clientConnection) {
      return res
        .status(500)
        .json({ error: "Erro ao conectar ao banco do cliente" });
    }

    // Aqui você pode adicionar mais validações ou retornar informações específicas do cliente
    return res.status(200).json({
      message: "Cliente autenticado com sucesso",
      nome_banco,
      codigo_verificacao,
    });
  } catch (error: any) {
    console.error("Erro na autenticação do cliente:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
