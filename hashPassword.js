const bcrypt = require("bcryptjs");

const password = "12345678"; // Senha que você quer testar
const hashedPassword = bcrypt.hashSync(password, 10);
console.log("Hash bcrypt da senha:", hashedPassword);

// Simulando a verificação de senha
const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
console.log("Resultado da comparação manual de senha:", isPasswordValid);
