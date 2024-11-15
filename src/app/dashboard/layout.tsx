import Sidebar from "../../components/Sidebar"; // Importa o Sidebar
import React from "react";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo do Dashboard */}
      <div className="flex-1 ml-64 p-6 bg-gray-100">{children}</div>
    </div>
  );
};

export default DashboardLayout;
