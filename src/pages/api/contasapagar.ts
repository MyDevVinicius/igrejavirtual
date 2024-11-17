import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db"; // Importando a função query do db.ts

// Função para buscar as contas a pagar no banco de dados
const getContasAPagar = async (status?: string) => {
  let sql = "SELECT * FROM contas_a_pagar"; // Consulta básica para retornar todas as contas
  const values: any[] = [];

  // Verifica se um status foi fornecido e, se sim, adiciona o filtro na consulta
  if (status && status !== "Todos") {
    sql += " WHERE status = ?"; // Adiciona o filtro de status
    values.push(status);
  }

  sql += " ORDER BY data_vencimento ASC"; // Ordena as contas por data de vencimento

  try {
    // Executa a consulta no banco de dados
    const rows = await query(sql, values);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    throw new Error(
      "Erro ao buscar contas: " +
        (error instanceof Error ? error.message : "Erro desconhecido")
    );
  }
};

// Função para atualizar o status da conta, verificando se está vencida ou não
const atualizarStatusContas = (contas: any[]) => {
  const today = new Date();

  return contas.map((conta) => {
    // Verifica se a data de vencimento já passou e se o status não foi alterado para "Pago" ou "Pago Parcial"
    const vencimento = new Date(conta.data_vencimento);
    if (
      vencimento < today &&
      conta.status !== "Pago" &&
      conta.status !== "Pago Parcial"
    ) {
      conta.status = "Vencida";
    } else if (
      vencimento >= today &&
      conta.status !== "Pago" &&
      conta.status !== "Pago Parcial"
    ) {
      conta.status = "Pendente";
    }
    return conta;
  });
};

// Handler para a API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { status } = req.query; // Obtém o status a partir da query string da requisição

    // Busca as contas a pagar com o status fornecido (ou sem filtro)
    let contas = await getContasAPagar(status as string);

    // Atualiza o status das contas para garantir que o status esteja correto
    contas = atualizarStatusContas(contas);

    // Retorna os dados da consulta em formato JSON
    res.status(200).json({
      message: "Sucesso",
      data: contas,
    });
  } catch (error) {
    // Trata o erro de forma segura
    console.error("Erro ao carregar contas:", error);
    res.status(500).json({
      message: "Erro ao carregar contas",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
