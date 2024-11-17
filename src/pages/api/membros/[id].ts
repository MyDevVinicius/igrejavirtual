// app/api/membros/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../../db"; // Certifique-se de que a pool está corretamente configurada

// Tipagem dos dados do membro para garantir que as propriedades sejam válidas
interface Membro {
  nome: string;
  data_nascimento: string;
  data_cadastro: string;
  endereco: string;
  batizado: boolean | null;
  telefone: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query; // Pegando o ID do membro a partir da URL

  // Garantir que o id seja válido
  if (typeof id !== "string" || isNaN(Number(id))) {
    return res.status(400).json({ message: "ID inválido ou não fornecido." });
  }

  switch (method) {
    case "PATCH": // Método para atualização parcial
    case "PUT": // Método para atualização total
      try {
        // Garantir que os dados estejam no formato correto
        const {
          nome,
          data_nascimento,
          data_cadastro,
          endereco,
          batizado,
          telefone,
        }: Membro = req.body;

        // Validação básica dos campos
        if (
          !nome ||
          !data_nascimento ||
          !data_cadastro ||
          !endereco ||
          !telefone
        ) {
          return res
            .status(400)
            .json({ message: "Campos obrigatórios não fornecidos" });
        }

        // Atualizando membro no banco de dados
        const [result]: any = await pool.execute(
          "UPDATE membros SET nome = ?, data_nascimento = ?, data_cadastro = ?, endereco = ?, batizado = ?, telefone = ? WHERE id = ?",
          [
            nome,
            data_nascimento,
            data_cadastro,
            endereco,
            batizado || null, // Garantir que batizado seja null ou um valor booleano
            telefone,
            id,
          ]
        );

        // Se nenhum membro foi atualizado (result.affectedRows será 0)
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Membro não encontrado para atualização" });
        }

        // Buscando os dados atualizados do membro
        const [updatedMembro]: any = await pool.execute(
          "SELECT id, nome, data_nascimento, data_cadastro, endereco, batizado, telefone FROM membros WHERE id = ?",
          [id]
        );

        // Retornando os dados do membro atualizado
        return res.status(200).json({
          message: "Membro atualizado com sucesso!",
          membro: updatedMembro[0], // Retornando os dados atualizados
        });
      } catch (error: any) {
        console.error("Erro ao atualizar membro:", error);
        return res.status(500).json({
          message: "Erro ao atualizar membro",
          error: error.message,
        });
      }

    default:
      return res.status(405).json({ message: "Método não permitido" });
  }
}
