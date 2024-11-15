import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../db"; // Certifique-se de que o caminho para o `db.ts` está correto

// Função para obter todas as contas a pagar
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Seleciona os dados corretos do banco de dados
      const [rows] = await pool.execute(
        "SELECT id, nome_conta, valor, data_vencimento, status, data_pagamento FROM contas_a_pagar"
      );

      // Verificar se há resultados
      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(200).json(rows);
      } else {
        return res
          .status(404)
          .json({ message: "Nenhuma conta a pagar encontrada" });
      }
    } catch (error) {
      console.error("Erro ao buscar contas a pagar:", error);
      return res
        .status(500)
        .json({ message: "Erro no servidor ao buscar contas a pagar" });
    }
  }

  // Criação de uma nova conta a pagar (POST)
  else if (req.method === "POST") {
    const { nome_conta, valor, data_vencimento, status } = req.body;

    if (!nome_conta || !valor || !data_vencimento || !status) {
      return res.status(400).json({ message: "Faltam dados obrigatórios" });
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO contas_a_pagar (nome_conta, valor, data_vencimento, status) VALUES (?, ?, ?, ?)",
        [nome_conta, valor, data_vencimento, status]
      );

      return res.status(201).json({
        message: "Conta a pagar criada com sucesso",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Erro ao criar conta a pagar:", error);
      return res.status(500).json({ message: "Erro ao criar conta a pagar" });
    }
  }

  // Atualizar status da conta a pagar (PUT)
  else if (req.method === "PUT") {
    const { id, status, data_pagamento } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Faltam dados obrigatórios" });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE contas_a_pagar SET status = ?, data_pagamento = ? WHERE id = ?",
        [status, data_pagamento, id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Conta a pagar não encontrada" });
      }

      return res
        .status(200)
        .json({ message: "Conta a pagar atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar conta a pagar:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar conta a pagar" });
    }
  }

  // Deletar conta a pagar (DELETE)
  else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID da conta a pagar é necessário" });
    }

    try {
      const [result] = await pool.execute(
        "DELETE FROM contas_a_pagar WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Conta a pagar não encontrada" });
      }

      return res
        .status(200)
        .json({ message: "Conta a pagar excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir conta a pagar:", error);
      return res.status(500).json({ message: "Erro ao excluir conta a pagar" });
    }
  }

  // Se o método não for suportado
  else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
