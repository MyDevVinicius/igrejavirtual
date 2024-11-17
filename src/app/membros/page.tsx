"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation"; // Hook de navegação do Next.js
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../../components/Security/ProtectedRoute";

// Interface para os dados do Membro
interface Membro {
  id: number;
  nome: string;
  data_cadastro: string;
  data_nascimento: string;
  endereco: string;
  batizado: boolean;
  ativo: boolean;
  telefone: string;
}

const MembrosPage: React.FC = () => {
  const router = useRouter();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);

  // Estados dos campos do formulário
  const [nome, setNome] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [batizado, setBatizado] = useState<boolean>(false);
  const [ativo, setAtivo] = useState<boolean>(false);

  useEffect(() => {
    // Carregar membros da API
    axios
      .get("/api/membros/[id]")
      .then((response) => setMembros(response.data))
      .catch(() => toast.error("Erro ao carregar membros"));

    // Configurar o modal para acessibilidade
    if (typeof window !== "undefined" && document.getElementById("__next")) {
      Modal.setAppElement("#__next");
    }
  }, []);

  // Abrir modal de cadastro ou edição
  const openModal = (membro: Membro | null) => {
    setEditingMembro(membro);
    if (membro) {
      setNome(membro.nome);
      setDataNascimento(membro.data_nascimento); // Preencher com data de nascimento
      setEndereco(membro.endereco);
      setTelefone(membro.telefone);
      setBatizado(membro.batizado);
      setAtivo(membro.ativo);
    } else {
      setNome("");
      setDataNascimento("");
      setEndereco("");
      setTelefone("");
      setBatizado(false);
      setAtivo(false);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingMembro(null);
  };

  // Função para excluir membro
  const deleteMembro = (id: number) => {
    axios
      .delete(`/api/membros/[id]?id=${id}`)
      .then(() => {
        setMembros((prevState) =>
          prevState.filter((membro) => membro.id !== id)
        );
        toast.success("Membro excluído com sucesso!");
      })
      .catch(() => toast.error("Erro ao excluir membro"));
  };

  // Função de validação do formulário
  const validateForm = (): boolean => {
    if (!nome || !dataNascimento || !endereco || !telefone) {
      toast.error("Todos os campos são obrigatórios.");
      return false;
    }
    return true;
  };

  // Função para formatar a data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Data Inválida"
      : date.toLocaleDateString("pt-BR");
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Validação do formulário

    const membroData = {
      nome,
      data_nascimento: dataNascimento,
      data_cadastro: editingMembro
        ? editingMembro.data_cadastro
        : new Date().toISOString().split("T")[0],
      endereco,
      batizado,
      telefone,
      ativo,
    };

    try {
      const res = editingMembro
        ? await axios.put(
            `/api/membros/[id]?id=${editingMembro.id}`,
            membroData
          )
        : await axios.post("/api/membros[id]", membroData);

      if (res.status === 200 || res.status === 201) {
        toast.success(
          editingMembro
            ? "Membro atualizado com sucesso!"
            : "Membro adicionado com sucesso!"
        );
        setMembros((prevState) => {
          if (editingMembro) {
            return prevState.map((membro) =>
              membro.id === editingMembro.id
                ? { ...membro, ...membroData }
                : membro
            );
          } else {
            return [...prevState, res.data];
          }
        });
        closeModal();
      }
    } catch (error) {
      toast.error("Erro ao salvar membro");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Gestão de Membros</h1>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-md mb-6 hover:bg-blue-600 transition"
          onClick={() => openModal(null)}
        >
          Adicionar Membro
        </button>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {[
                "Nome",
                "Data de Cadastro",
                "Data de Nascimento",
                "Endereço",
                "Telefone",
                "Batizado",
                "Ativo",
                "Ações",
              ].map((header) => (
                <th key={header} className="py-2 px-4 border-b text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {membros.map((membro) => (
              <tr key={membro.id}>
                <td className="py-2 px-4 border-b">{membro.nome}</td>
                <td className="py-2 px-4 border-b">
                  {formatDate(membro.data_cadastro)}
                </td>
                <td className="py-2 px-4 border-b">
                  {formatDate(membro.data_nascimento)}
                </td>
                <td className="py-2 px-4 border-b">{membro.endereco}</td>
                <td className="py-2 px-4 border-b">{membro.telefone}</td>
                <td className="py-2 px-4 border-b">
                  {membro.batizado ? "Sim" : "Não"}
                </td>
                <td className="py-2 px-4 border-b">
                  {membro.ativo ? "Sim" : "Não"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600 transition"
                    onClick={() => openModal(membro)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => deleteMembro(membro.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para adicionar/editar membro */}
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          appElement={document.getElementById("__next") || document.body}
          className="modal max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
            {editingMembro ? "Editar Membro" : "Adicionar Membro"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="nome"
                className="block text-gray-700 font-semibold"
              >
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-input mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="data_nascimento"
                className="block text-gray-700 font-semibold"
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                id="data_nascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="form-input mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="endereco"
                className="block text-gray-700 font-semibold"
              >
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="form-input mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="telefone"
                className="block text-gray-700 font-semibold"
              >
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="form-input mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <label
                htmlFor="batizado"
                className="block text-gray-700 font-semibold mr-2"
              >
                Batizado
              </label>
              <input
                type="checkbox"
                id="batizado"
                checked={batizado}
                onChange={(e) => setBatizado(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label
                htmlFor="ativo"
                className="block text-gray-700 font-semibold mr-2"
              >
                Ativo
              </label>
              <input
                type="checkbox"
                id="ativo"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-150 ease-in-out shadow-lg"
              >
                {editingMembro ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Toast Container */}
        <ToastContainer position="top-right" />
      </div>
    </ProtectedRoute>
  );
};

export default MembrosPage;
