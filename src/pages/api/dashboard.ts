import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Consultar saldo atual (somando todas as entradas confirmadas)
    const [saldoAtual]: any[] = await pool.query(
      "SELECT SUM(valor) AS saldo FROM entradas WHERE status = 'confirmada'"
    );

    // Consultar todas as entradas
    const [entradas]: any[] = await pool.query("SELECT valor FROM entradas");

    // Consultar todas as saídas
    const [saidas]: any[] = await pool.query("SELECT valor FROM saidas");

    // Consultar a quantidade de membros
    const [membros]: any[] = await pool.query(
      "SELECT COUNT(*) AS total FROM membros"
    );

    // Consultar contas a pagar
    const [contasAPagar]: any[] = await pool.query(
      "SELECT nome_conta, valor, status, data_vencimento FROM contas_a_pagar"
    );

    // Retornar os dados
    res.status(200).json({
      saldoAtual: saldoAtual[0]?.saldo || 0,
      entradas: entradas.reduce(
        (acc: number, entry: { valor: number }) => acc + entry.valor,
        0
      ),
      saidas: saidas.reduce(
        (acc: number, exit: { valor: number }) => acc + exit.valor,
        0
      ),
      quantidadeMembros: membros[0]?.total || 0,
      contasAPagar: contasAPagar,
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
}
