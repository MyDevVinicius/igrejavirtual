"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar/Sidebar"; // Certifique-se de que o caminho está correto

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  membro_id: number | null;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("cooperador");
  const [membroId, setMembroId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const codigoVerificacao = localStorage.getItem("codigo_verificacao");
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!codigoVerificacao || !nomeBanco) {
      toast.error("Chave de verificação ou banco não encontrados!");
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`/api/fulluser?banco=${nomeBanco}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          toast.error("Erro ao carregar usuários.");
        }
      } catch (error) {
        toast.error("Erro ao buscar usuários.");
      }
    };

    fetchUsuarios();
  }, []);

  const handleOpenForm = () => setIsEditing(true);
  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingUser(null);
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("cooperador");
    setMembroId(null);
  };

  const handleAddUser = async () => {
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!nomeBanco) {
      toast.error("Nome do banco não encontrado!");
      return;
    }

    try {
      const response = await fetch(`/api/fulluseradd?banco=${nomeBanco}`, {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          senha,
          cargo,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsuarios(data.usuarios);
        toast.success("Usuário adicionado com sucesso!");
        handleCloseForm();
      } else {
        toast.error(data.message || "Erro ao adicionar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao adicionar usuário.");
    }
  };

  const handleEditUser = async () => {
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!nomeBanco) {
      toast.error("Nome do banco não encontrado!");
      return;
    }

    try {
      const response = await fetch(`/api/fulluseredit?banco=${nomeBanco}`, {
        method: "PUT",
        body: JSON.stringify({
          id: editingUser?.id,
          nome,
          email,
          senha,
          cargo,
          usuario_id: editingUser?.usuario_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsuarios(data.usuarios);
        toast.success("Usuário atualizado com sucesso!");
        handleCloseForm();
      } else {
        toast.error(data.message || "Erro ao atualizar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar usuário.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const nomeBanco = localStorage.getItem("nome_banco");

    if (!nomeBanco) {
      toast.error("Nome do banco não encontrado!");
      return;
    }

    try {
      const response = await fetch(
        `/api/fulluserdelete?id=${id}&banco=${nomeBanco}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
        toast.success("Usuário deletado com sucesso!");
      } else {
        toast.error(data.message || "Erro ao deletar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao deletar usuário.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar dentro da página com largura fixa e margem direita */}
      <Sidebar className="w-60" />

      {/* Conteúdo da página com margem à esquerda para evitar sobreposição */}
      <div className="flex-1 p-6 bg-gray-100 ml-64">
        <h1 className="text-2xl font-bold mb-4 text-media">Usuários</h1>
        <button
          onClick={handleOpenForm}
          className="bg-media text-white px-4 py-2 rounded"
        >
          + Novo Usuario
        </button>
        {isEditing && (
          <div className="mt-4 p-4 border text-balck font-bold">
            <h2>{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
                className="border p-2 my-2 w-full border-media text-balck font-bold"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="border p-2 my-2 w-full border-media text-balck font-bold "
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
                className="border p-2 my-2 w-full border-media text-balck font-bold "
              />
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
                className="border p-2 my-2 w-full border-media text-balck font-bold"
              >
                <option value="cooperador">Cooperador</option>
                <option value="pastor">Pastor</option>
                <option value="tesoureiro">Tesoureiro</option>
                <option value="diacono">Diácono</option>
                <option value="conselho_fiscal">Conselho Fiscal</option>
              </select>
              <button
                onClick={editingUser ? handleEditUser : handleAddUser}
                className="bg-media text-white p-2 rounded mt-4 w-full"
              >
                {editingUser ? "Salvar Alterações" : "Cadastrar Usuário"}
              </button>
              <button
                onClick={handleCloseForm}
                className="bg-gray-500 text-white p-2 rounded mt-2 w-full"
              >
                Fechar
              </button>
            </form>
          </div>
        )}
        <div className="mt-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-media text-bold border-media">
                  Nome
                </th>
                <th className="border px-4 py-2 text-media text-bold border-media">
                  Email
                </th>
                <th className="border px-4 py-2 text-media text-bold border-media ">
                  Cargo
                </th>
                <th className="border px-4 py-2 text-media text-bold border-media">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="border px-4 py-2  text-black font-bold border-media">
                    {usuario.nome}
                  </td>
                  <td className="border px-4 py-2 text-black text-center font-bold border-media">
                    {usuario.email}
                  </td>
                  <td className="border px-4 py-2 text-black text-center font-bold border-media">
                    {usuario.cargo}
                  </td>
                  <td className="border px-4 py-2 text-black text-center font-bold border-media">
                    <button
                      onClick={() => {
                        setEditingUser(usuario);
                        setNome(usuario.nome);
                        setEmail(usuario.email);
                        setSenha(usuario.senha);
                        setCargo(usuario.cargo);
                        setIsEditing(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default UsuariosPage;
