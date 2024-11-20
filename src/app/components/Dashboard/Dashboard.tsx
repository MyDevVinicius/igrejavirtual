"use client"; // Adicionando a diretiva de cliente

import SaldoAtual from "./SaldoAtual";
import Entradas from "./Entradas";
import Saidas from "./Saidas";
import UsuariosAtivos from "./UsuariosAtivos";
import Membros from "./Membros";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 p-2">
      {" "}
      {/* Espaçamento mínimo */}
      {/* Contêiner de Saldo Atual */}
      <div className="flex justify-center p-1">
        <SaldoAtual />
      </div>
      {/* Contêiner de Entradas */}
      <div className="flex justify-center p-1">
        <Entradas />
      </div>
      {/* Contêiner de Saídas */}
      <div className="flex justify-center p-1">
        <Saidas />
      </div>
      {/* Contêiner de Usuários Ativos */}
      <div className="flex justify-center p-1">
        <UsuariosAtivos />
      </div>
      {/* Contêiner de Membros */}
      <div className="flex justify-center p-1">
        <Membros />
      </div>
    </div>
  );
};

export default Dashboard;
