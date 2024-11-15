import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Limpar o cookie userEmail
  res.setHeader(
    "Set-Cookie",
    serialize("userEmail", "", {
      path: "/",
      maxAge: -1, // Define o cookie para expirar imediatamente
    })
  );

  // Redirecionar para a página de login
  res.writeHead(302, { Location: "/login" });
  res.end();
}
