import { createPool } from "mysql2/promise";

// Criando o pool de conexões
const pool = createPool({
  host: "localhost",
  user: "root", // seu usuário MySQL
  password: "!wVB3=Yx#y?4.p_?XUTN", // sua senha do MySQL
  database: "igreja_virtual", // nome do seu banco de dados
  waitForConnections: true,
  connectionLimit: 10, // Limite de conexões no pool
  queueLimit: 0, // Limite de consultas na fila
});

// Função para executar consultas SQL
export const query = async (sql: string, values: any[] = []): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, values); // Executando a consulta SQL
    return rows; // Retorna os resultados da consulta
  } catch (error) {
    console.error("Erro ao executar consulta:", error);
    throw new Error("Erro ao executar consulta SQL");
  }
};

// Função para verificar a conexão com o banco de dados (não precisa ser exportada)
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado ao banco de dados MySQL");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados MySQL:", error);
    throw new Error("Erro ao conectar ao banco de dados MySQL");
  }
};

// Verificando a conexão logo após a inicialização
checkConnection();

// Exportando apenas o pool para ser usado em outros arquivos
export { pool };
