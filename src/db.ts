import { createPool } from "mysql2/promise";

// Criando o pool de conexões
const pool = createPool({
  host: "localhost",
  user: "root", // seu usuário MySQL
  password: "!wVB3=Yx#y?4.p_?XUTN", // sua senha do MySQL
  database: "igreja_virtual", // nome do seu banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Função para executar as consultas SQL
export const query = async (sql: string, values: any[]) => {
  const [rows] = await pool.execute(sql, values); // Executando a consulta SQL
  return rows; // Retorna os resultados da consulta
};

// Verificar a conexão com o banco de dados (opcional)
pool
  .getConnection()
  .then((connection) => {
    console.log("Conectado ao banco de dados MySQL");
    connection.release(); // Libera a conexão após o teste
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados MySQL:", error);
  });

export { pool }; // Exporta o pool para ser usado em outros arquivos
