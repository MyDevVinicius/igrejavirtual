"use client"; // Certifique-se de que essa linha está no topo

import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

interface Membro {
  id: number;
  nome: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [members, setMembers] = useState<Membro[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cargo, setCargo] = useState("Levita");
  const [membroId, setMembroId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data: Usuario[] = await response.json();
          setUsuarios(data);
        } else {
          toast.error("Erro ao buscar usuários.");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.");
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data: Membro[] = await response.json();
          setMembers(data);
        } else {
          toast.error("Erro ao buscar membros.");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.");
      }
    };

    fetchUsuarios();
    fetchMembers();
  }, []);

  const handleAddUser = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, cargo, membroId }),
      });

      if (response.ok) {
        const newUser: Usuario = await response.json();
        setUsuarios([...usuarios, newUser]);
        toast.success("Usuário adicionado com sucesso.");
        setShowAddPopup(false);
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setCargo("Levita");
        setMembroId(null);
      } else {
        toast.error("Erro ao adicionar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao adicionar usuário.");
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100 ml-64">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Usuários</h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Adicionar Usuário
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Nome</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Cargo</th>
                <th className="py-2 px-4 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="py-2 px-4 border-b">{usuario.nome}</td>
                  <td className="py-2 px-4 border-b">{usuario.email}</td>
                  <td className="py-2 px-4 border-b">{usuario.cargo}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => {}}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {}}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup para adicionar usuário */}
        {showAddPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Adicionar Usuário</h3>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="Levita">Levita</option>
                <option value="Líder">Líder</option>
                <option value="Pastor">Pastor</option>
              </select>
              <select
                value={membroId || ""}
                onChange={(e) => setMembroId(Number(e.target.value))}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">Selecione o Membro</option>
                {members.map((membro) => (
                  <option key={membro.id} value={membro.id}>
                    {membro.nome}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddPopup(false)}
                  className="py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddUser}
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default UsuariosPage;
