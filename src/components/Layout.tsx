import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full relative isolate">
            <div className="background-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <header className="w-full bg-gray-950/40 backdrop-blur-md fixed top-0 z-40 border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            Orbit
          </Link>
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-400 hidden sm:inline">{user?.sub}</span>
                <Link
                  to="/projects"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 font-medium"
                >
                  <LayoutDashboard size={18} /> Projetos
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[#5F4BB6] text-white font-bold py-1.5 px-4 rounded-md hover:bg-[#4A3B9A] transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#5F4BB6] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4A3B9A] transition-colors"
                >
                  Cadastre-se
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="w-full pt-[70px] pb-8">
        {children}
      </main>
    </div>
  );
}