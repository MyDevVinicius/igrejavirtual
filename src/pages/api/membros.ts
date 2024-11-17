import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de que a pool de conexão está configurada corretamente.

// Função para formatar a data no formato MySQL (YYYY-MM-DD HH:mm:ss)
const formatDate = (date: string): string => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const day = newDate.getDate().toString().padStart(2, "0");
  const hours = newDate.getHours().toString().padStart(2, "0");
  const minutes = newDate.getMinutes().toString().padStart(2, "0");
  const seconds = newDate.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query; // ID do membro, fornecido via query string (quando aplicável)

  try {
    switch (method) {
      // GET: Recuperar todos os membros
      case "GET":
        const [rows] = await pool.execute("SELECT * FROM members");
        if (Array.isArray(rows) && rows.length > 0) {
          return res.status(200).json(rows);
        }
        return res.status(404).json({ message: "Nenhum membro encontrado." });

      // POST: Adicionar um novo membro
      case "POST": {
        const {
          nome,
          data_nascimento,
          data_cadastro,
          endereco,
          batizado,
          telefone,
        } = req.body;

        // Validação de campos obrigatórios
        if (
          !nome ||
          !data_nascimento ||
          !data_cadastro ||
          !endereco ||
          !telefone
        ) {
          return res.status(400).json({
            message: "Todos os campos obrigatórios devem ser preenchidos.",
          });
        }

        const formattedDataCadastro = formatDate(data_cadastro);

        // Inserir novo membro na base de dados
        const [insertResult] = await pool.execute(
          "INSERT INTO members (nome, data_nascimento, data_cadastro, endereco, batizado, telefone) VALUES (?, ?, ?, ?, ?, ?)",
          [
            nome,
            data_nascimento,
            formattedDataCadastro,
            endereco,
            batizado ?? 0,
            telefone,
          ]
        );

        return res.status(201).json({
          message: "Membro adicionado com sucesso!",
          id: insertResult.insertId,
        });
      }

      // PUT: Atualizar um membro existente
      case "PUT": {
        if (!id || isNaN(Number(id))) {
          return res
            .status(400)
            .json({ message: "ID inválido ou não fornecido." });
        }

        const {
          nome,
          data_nascimento,
          data_cadastro,
          endereco,
          batizado,
          telefone,
        } = req.body;

        // Validação de campos obrigatórios
        if (
          !nome ||
          !data_nascimento ||
          !data_cadastro ||
          !endereco ||
          !telefone
        ) {
          return res.status(400).json({
            message: "Todos os campos obrigatórios devem ser preenchidos.",
          });
        }

        const formattedDataCadastro = formatDate(data_cadastro);

        // Atualizar membro na base de dados
        const [updateResult] = await pool.execute(
          "UPDATE members SET nome = ?, data_nascimento = ?, data_cadastro = ?, endereco = ?, batizado = ?, telefone = ? WHERE id = ?",
          [
            nome,
            data_nascimento,
            formattedDataCadastro,
            endereco,
            batizado ?? 0,
            telefone,
            Number(id),
          ]
        );

        if ((updateResult as any).affectedRows === 0) {
          // Tipagem correta do resultado da query
          return res
            .status(404)
            .json({ message: "Membro não encontrado para atualização." });
        }

        return res
          .status(200)
          .json({ message: "Membro atualizado com sucesso!" });
      }

      // DELETE: Excluir um membro existente
      case "DELETE": {
        if (!id || isNaN(Number(id))) {
          return res
            .status(400)
            .json({ message: "ID inválido ou não fornecido." });
        }

        // Excluir membro da base de dados
        const [deleteResult] = await pool.execute(
          "DELETE FROM members WHERE id = ?",
          [Number(id)]
        );

        if ((deleteResult as any).affectedRows === 0) {
          // Tipagem correta do resultado da query
          return res
            .status(404)
            .json({ message: "Membro não encontrado para exclusão." });
        }

        return res
          .status(200)
          .json({ message: "Membro excluído com sucesso!" });
      }

      // Caso o método não seja permitido
      default:
        return res
          .status(405)
          .json({ message: `Método ${method} não permitido.` });
    }
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error);
    return res.status(500).json({
      message: "Erro interno no servidor.",
      error: error.message || "Erro desconhecido",
    });
  }
}
