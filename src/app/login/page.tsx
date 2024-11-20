"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importando o componente de imagem
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isCodigoVerificacaoValidado, setIsCodigoVerificacaoValidado] =
    useState(false);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const router = useRouter();

  // Verifica se o banco já está salvo no localStorage ao carregar a página
  useEffect(() => {
    const nome_banco = localStorage.getItem("nome_banco");
    if (nome_banco) {
      setIsCodigoVerificacaoValidado(true); // Banco já salvo, então podemos pular a validação do código
    }
  }, []);

  // Função para validar o código de verificação e salvar o nome do banco no localStorage
  const handleCodigoVerificacaoSubmit = async () => {
    setErro(""); // Limpa erros anteriores
    setLoading(true); // Ativa o carregamento ao submeter o código

    if (!codigoVerificacao) {
      setErro("O código de verificação é necessário.");
      toast.error("O código de verificação é necessário.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        body: JSON.stringify({ codigo_verificacao: codigoVerificacao }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        setErro(data.error);
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Salva o nome do banco no localStorage
      localStorage.setItem("nome_banco", data.nome_banco);
      localStorage.setItem("codigo_verificacao", codigoVerificacao);
      setIsCodigoVerificacaoValidado(true); // Código validado com sucesso
      toast.success("Código validado com sucesso!");
      setLoading(false);
    } catch (error) {
      console.error("Erro ao validar o código de verificação:", error);
      setErro("Erro ao validar o código de verificação.");
      toast.error("Erro ao validar o código de verificação.");
      setLoading(false);
    }
  };

  // Função para fazer o login após o código de verificação ser validado
  const handleLoginSubmit = async () => {
    setErro(""); // Limpa erros anteriores
    setLoading(true); // Ativa o carregamento ao submeter o login

    if (!email || !senha) {
      setErro("Por favor, insira o e-mail e a senha.");
      toast.error("Por favor, insira o e-mail e a senha.");
      setLoading(false);
      return;
    }

    const nome_banco = localStorage.getItem("nome_banco");
    const codigo_verificacao = localStorage.getItem("codigo_verificacao");

    if (!nome_banco || !codigo_verificacao) {
      setErro("Banco de dados do cliente não encontrado.");
      toast.error("Banco de dados do cliente não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          email,
          senha,
          nome_banco,
          codigo_verificacao,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        setErro(data.error);
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Redireciona para a página do dashboard após login bem-sucedido
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao autenticar o usuário:", error);
      setErro("Erro ao autenticar o usuário.");
      toast.error("Erro ao autenticar o usuário.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-white border rounded-md shadow-lg shadow-media">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="flex justify-center mb-4">
          <Image src="/logosoft.png" alt="Logo" width={320} height={100} />{" "}
          {/* Certifique-se de que a imagem está na pasta public */}
        </div>

        {!isCodigoVerificacaoValidado ? (
          <div>
            <label className="block mb-2 text-sm font-bold text-media">
              Insira o Código de Verificação
            </label>
            <input
              type="text"
              value={codigoVerificacao}
              onChange={(e) => setCodigoVerificacao(e.target.value)}
              className="w-full p-2 border border-media rounded mb-4"
              disabled={loading}
            />
            <button
              onClick={handleCodigoVerificacaoSubmit}
              className={`w-full py-2 bg-media text-white font-bold rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Validando..." : "Validar Código"}
            </button>
          </div>
        ) : (
          <div>
            <label className="block mb-2 text-sm font-bold text-media ">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4 border-media"
              disabled={loading}
            />
            <label className="block mb-2 text-sm font-bold text-media">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border rounded mb-4 border-media"
              disabled={loading}
            />
            <button
              onClick={handleLoginSubmit}
              className={`w-full py-2 bg-media text-white rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        )}

        {erro && <p className="mt-4 text-red-500 text-sm">{erro}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
