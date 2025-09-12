import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/projects');
    } catch {
      setError('Falha no login. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div className="flex justify-center pt-16">
      {/* === ESTILO DE VIDRO FOSCO APLICADO AQUI === */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900/40 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Login no Orbit</h1>
        
        <a 
          href="http://localhost:8080/oauth2/authorization/google"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          <img src="/icons8-google.svg" alt="Google logo" className="w-5 h-5"/>
          Entrar com Google
        </a>

        <div className="flex items-center text-center">
            <hr className="flex-grow border-white/10"/>
            <span className="px-4 text-sm text-gray-400">OU</span>
            <hr className="flex-grow border-white/10"/>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Seu e-mail"
                className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <KeyRound className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
                className="w-full pl-10 pr-10 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-[#5F4BB6] rounded-md hover:bg-[#4A3B9A] transition-colors">
            Entrar
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-[#9888E6] hover:text-white">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}