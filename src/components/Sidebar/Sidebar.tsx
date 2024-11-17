"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Para redirecionamento
import Link from "next/link";
import {
  FaHome,
  FaMoneyCheckAlt,
  FaUsers,
  FaUserShield,
  FaHeadset,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

const Sidebar = ({
  isExpanded,
  toggleSidebar,
}: {
  isExpanded: boolean;
  toggleSidebar: () => void;
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Fazendo a requisição para a API de logout
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Falha ao fazer logout");
      }

      // Redireciona para a página de login após o logout
      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <div
      className={`bg-primary text-white p-4 h-screen fixed top-0 left-0 flex flex-col justify-between transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      {/* Botão de expandir/recolher */}
      <div
        className={`absolute ${
          isExpanded
            ? "top-2 right-0"
            : "top-[-10px] left-1/2 transform -translate-x-1/2 mt-0 mb-12"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-full shadow-none flex items-center justify-center bg-transparent"
        >
          {isExpanded ? (
            <FiChevronsLeft size={36} />
          ) : (
            <FiChevronsRight size={36} />
          )}
        </button>
      </div>

      {/* Logo */}
      {isExpanded && (
        <div className="flex items-center justify-center mb-4 mt-16">
          <img src="/logoescura.png" alt="Logo" className="w-280 h-auto" />
        </div>
      )}

      {/* Menu */}
      <ul className="space-y-4 mt-4">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaHome className="mr-2" />
            {isExpanded && "Início"}
          </Link>
        </li>
        <li>
          <Link
            href="/financeiro"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaMoneyCheckAlt className="mr-2" />
            {isExpanded && "Financeiro"}
          </Link>
        </li>
        <li>
          <Link
            href="/membros"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaUsers className="mr-2" />
            {isExpanded && "Membros"}
          </Link>
        </li>
        <li>
          <Link
            href="/usuarios"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaUserShield className="mr-2" />
            {isExpanded && "Usuários"}
          </Link>
        </li>
        <li>
          <Link
            href="/relatorios"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaFileAlt className="mr-2" />
            {isExpanded && "Relatórios"}
          </Link>
        </li>
      </ul>

      {/* Rodapé */}
      <div className="space-y-4 mt-auto">
        <button className="flex items-center w-full text-lg bg-yellow-500 text-white hover:bg-yellow-600 py-2 px-4 rounded">
          <FaHeadset className="mr-2" />
          {isExpanded && "Suporte"}
          {!isExpanded && <FaHeadset size={24} />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center w-full text-lg bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded mt-4"
        >
          <FaSignOutAlt className="mr-2" />
          {isExpanded && "Sair"}
          {!isExpanded && <FaSignOutAlt size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
