import React from "react";
import Saidas from "../../components/Dashboard/UsuariosAtivos"; // Certifique-se de que o caminho está correto

const EntradasPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Página de Entradas
        </h2>
        <Saidas />
      </div>
    </div>
  );
};

export default EntradasPage;
