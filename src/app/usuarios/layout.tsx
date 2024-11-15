// layout.tsx
import Sidebar from "../../components/Sidebar"; // Ajuste o caminho da importação

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo do Dashboard ajustado para mais próximo da sidebar */}
      <div className="flex-1 p-6 bg-gray-100 ml-16">
        {" "}
        {/* Reduzimos a margem à esquerda de ml-64 para ml-16 */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
