import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-xl font-bold hover:text-gray-300">Orbit</Link>
            {isAuthenticated && (
              <Link to="/projects" className="hover:underline">Meus Projetos</Link>
            )}
          </nav>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">{user?.sub}</span>
                <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Registrar</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}