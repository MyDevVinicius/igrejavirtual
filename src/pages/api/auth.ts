import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Função para criar a conexão dinâmica ao banco do cliente
const getConnection = async (nome_banco: string) => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: nome_banco,
  });
  return pool;
};

// Função para validar o usuário
const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, senha, nome_banco, codigo_verificacao } = req.body;

  // Verifica se as informações essenciais foram fornecidas
  if (!email || !senha || !nome_banco || !codigo_verificacao) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Cria a conexão com o banco de dados dinâmico
    const pool = await getConnection(nome_banco);

    // Busca o usuário no banco do cliente
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verifica a senha
    const usuario = (rows as any[])[0];
    const senhaValida = bcrypt.compareSync(senha, usuario.senha); // Usa bcrypt para comparar a senha

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Se tudo estiver correto, retorna o sucesso
    return res
      .status(200)
      .json({ message: "Usuário autenticado com sucesso!" });
  } catch (error) {
    console.error("Erro ao validar o usuário:", error);
    return res.status(500).json({ error: "Erro ao autenticar o usuário." });
  }
};

// Exporte a função como default para Next.js reconhecer
export default authHandler;
