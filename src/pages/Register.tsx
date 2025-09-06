import { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login'); // Redireciona para o login após o registro
    } catch {
      setError('Erro ao registrar. O e-mail já pode estar em uso.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800">Crie sua Conta</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                    text-gray-900"/>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                text-gray-900">
                    Registrar
                </button>
            </form>
             <p className="text-sm text-center text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Faça login
              </Link>
            </p>
        </div>
    </div>
  );
}