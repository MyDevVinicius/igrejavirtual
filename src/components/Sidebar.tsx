"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaMoneyCheckAlt,
  FaUsers,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [usuario, setUsuario] = useState<string | null>("Carregando...");

  useEffect(() => {
    // Acessando localStorage somente no cliente
    const storedUserName = localStorage.getItem("usuario_nome");
    if (storedUserName) {
      setUsuario(storedUserName);
    } else {
      setUsuario("Nome não encontrado");
    }
  }, []); // O hook só será executado no cliente após o primeiro render

  return (
    <div className="sidebar bg-primary text-white p-4 w-64 h-screen fixed top-0 left-0">
      <div className="flex items-center justify-center mb-8">
        <img src="/logoescura.png" alt="Logo" className="w-300 h-auto" />
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">
        Bem-vindo, {usuario}
      </h2>

      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaHome className="mr-2" />
            Início
          </Link>
        </li>
        <li>
          <Link
            href="/financeiro"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaMoneyCheckAlt className="mr-2" />
            Financeiro
          </Link>
        </li>
        <li>
          <Link
            href="/membros"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaUsers className="mr-2" />
            Membros
          </Link>
        </li>
        <li>
          <Link
            href="/usuarios"
            className="flex items-center text-lg hover:text-blue-400"
          >
            <FaUserShield className="mr-2" />
            Usuários
          </Link>
        </li>
        <li>
          <Link
            href="/api/logout"
            className="flex items-center w-full text-lg bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded mt-4"
          >
            <FaSignOutAlt className="mr-2" />
            Sair
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
