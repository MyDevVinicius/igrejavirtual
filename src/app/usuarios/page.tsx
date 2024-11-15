"use client"; // Adicione esta linha no topo do arquivo

import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("Levita");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [usuarioIdToDelete, setUsuarioIdToDelete] = useState<number | null>(
    null
  );
  const [showEditPasswordPopup, setShowEditPasswordPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [usuarioIdToEditPassword, setUsuarioIdToEditPassword] = useState<
    number | null
  >(null);

  // Buscar usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        toast.error("Erro ao buscar usuários.");
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Usuário deletado com sucesso.");
        setUsuarios(usuarios.filter((user) => user.id !== userId));
        setConfirmDelete(false);
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao deletar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao deletar usuário.");
    }
  };

  // Adicionar novo usuário
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
        body: JSON.stringify({ nome, email, senha, cargo }),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsuarios([...usuarios, newUser]);
        toast.success("Usuário adicionado com sucesso.");
        setShowAddPopup(false); // Fechar o popup após adicionar
        // Resetar os campos
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setCargo("Levita");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Erro ao adicionar usuário.");
    }
  };

  //editar usuarios
  const handleEditPassword = async () => {
    if (!senhaAtual || !novaSenha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${usuarioIdToEditPassword}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      if (response.ok) {
        toast.success("Senha alterada com sucesso.");
        setShowEditPasswordPopup(false);
        setSenhaAtual("");
        setNovaSenha("");
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao editar senha.");
      }
    } catch (error) {
      toast.error("Erro ao editar a senha.");
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
                  <td className="px-4 py-2 border-b">{usuario.cargo}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => {
                        setShowEditPasswordPopup(true);
                        setUsuarioIdToEditPassword(usuario.id);
                      }}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar Senha
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
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
                <option value="Tesoureiro">Tesoureiro</option>
                <option value="Cooperador">Cooperador</option>
                <option value="Diácono">Diácono</option>
                <option value="Pastor">Pastor</option>
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
                  className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup para editar senha */}
        {showEditPasswordPopup && usuarioIdToEditPassword !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Editar Senha</h3>
              <input
                type="password"
                placeholder="Senha Atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="password"
                placeholder="Nova Senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditPasswordPopup(false)}
                  className="py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditPassword}
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UsuariosPage;
