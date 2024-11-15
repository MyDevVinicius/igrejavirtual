const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "!wVB3=Yx#y?4.p_?XUTN",
  database: "igreja_virtual",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conexão bem-sucedida ao banco de dados MySQL");
    connection.release();
  }
});
