import jwt from "jsonwebtoken";

// Define a chave secreta para verificar o token (isso geralmente deve ser armazenado de forma segura)
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key"; // Use uma variável de ambiente para segurança

// Função para verificar o token JWT
export const verifyToken = (token: string): boolean => {
  try {
    // Verifica se o token é válido usando a chave secreta
    jwt.verify(token, SECRET_KEY);
    return true; // O token é válido
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return false; // O token não é válido
  }
};
