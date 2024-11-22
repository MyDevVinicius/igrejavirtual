"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isCodigoVerificacaoValidado, setIsCodigoVerificacaoValidado] =
    useState(false);
  const [nomeIgreja, setNomeIgreja] = useState<string | null>(null);
  const [isClienteAtivo, setIsClienteAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Usando o useEffect para verificar o localStorage na carga do componente
  useEffect(() => {
    const nome_banco = localStorage.getItem("nome_banco");
    const nome_igreja = localStorage.getItem("nome_igreja");
    const clienteAtivo = localStorage.getItem("cliente_ativo") === "true";

    // Verifica se as chaves estão no localStorage antes de atualizar o estado
    if (nome_banco && nome_igreja && clienteAtivo) {
      setIsCodigoVerificacaoValidado(true);
      setNomeIgreja(nome_igreja || "Igreja não definida");
      setIsClienteAtivo(clienteAtivo);
    } else {
      console.log("Erro: As chaves não foram encontradas no localStorage.");
    }
  }, []);

  // Função para validar o código de verificação
  const handleCodigoVerificacaoSubmit = async () => {
    setErro("");
    setLoading(true);

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

      if (!data.status || data.status !== "ativo") {
        setIsClienteAtivo(false);
        localStorage.setItem("cliente_ativo", "false");
        toast.error("O cliente está inativo. Acesso bloqueado.");
        setLoading(false);
        return;
      }

      // Armazenar os dados no localStorage
      localStorage.setItem("nome_banco", data.nome_banco);
      localStorage.setItem("nome_igreja", data.nome_igreja);
      localStorage.setItem("cliente_ativo", "true");
      localStorage.setItem("codigo_verificacao", codigoVerificacao);

      setNomeIgreja(data.nome_igreja);
      setIsClienteAtivo(true);
      setIsCodigoVerificacaoValidado(true);
      toast.success(
        `Código validado com sucesso! Licenciado para ${data.nome_igreja}`
      );
      setLoading(false);
    } catch (error) {
      console.error("Erro ao validar o código de verificação:", error);
      setErro("Erro ao validar o código de verificação.");
      toast.error("Erro ao validar o código de verificação.");
      setLoading(false);
    }
  };

  // Função para submeter o login do usuário
  const handleLoginSubmit = async () => {
    setErro("");
    setLoading(true);

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

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao autenticar o usuário:", error);
      setErro("Erro ao autenticar o usuário.");
      toast.error("Erro ao autenticar o usuário.");
      setLoading(false);
    }
  };

  // Se o cliente não estiver ativo, exibe mensagem
  if (!isClienteAtivo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-6 bg-white border rounded-md shadow-lg">
          <ToastContainer position="top-right" autoClose={5000} />
          <div className="flex justify-center mb-4">
            <Image src="/logosoft.png" alt="Logo" width={320} height={100} />
          </div>
          <p className="text-center text-red-500 font-bold">
            Este cliente está inativo. Acesso bloqueado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-white border rounded-md shadow-lg">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="flex justify-center mb-4">
          <Image src="/logosoft.png" alt="Logo" width={320} height={100} />
        </div>

        {!isCodigoVerificacaoValidado ? (
          <div>
            <label className="block mb-2 text-sm font-bold">
              Código de Verificação
            </label>
            <input
              type="text"
              value={codigoVerificacao}
              onChange={(e) => setCodigoVerificacao(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              disabled={loading}
            />
            <button
              onClick={handleCodigoVerificacaoSubmit}
              className={`w-full py-2 bg-blue-500 text-white font-bold rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Validando..." : "Validar Código"}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Licenciado para: {nomeIgreja || "Igreja não definida"}
            </p>
            <label className="block mb-2 text-sm font-bold">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              disabled={loading}
            />
            <label className="block mb-2 text-sm font-bold">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              disabled={loading}
            />
            <button
              onClick={handleLoginSubmit}
              className={`w-full py-2 bg-blue-500 text-white rounded ${
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
