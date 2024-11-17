import Sidebar from "../../components/Sidebar/Sidebar"; // Importa o Sidebar
import React, { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Conteúdo do Dashboard */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default DashboardLayout;
