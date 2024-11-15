"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false); // Adicionar estado para verificar se está no cliente
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salvar nome do usuário no localStorage
      localStorage.setItem("usuario_nome", data.nome);

      // Mostrar notificação de sucesso
      toast.success("Login realizado com sucesso!");

      // Redirecionar para a página inicial ou dashboard após alguns segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      // Mostrar notificação de erro
      toast.error(data.error || "Erro ao fazer login");
    }
  };

  if (!isClient) {
    return null; // Renderizar null no servidor
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-400 max-w-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logoigrejavirtual.png"
            alt="Logo"
            width={300}
            height={100}
            className="mx-auto"
          />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default Login;
