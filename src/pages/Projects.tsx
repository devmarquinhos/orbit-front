import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/projects/user/${user.id}`);
        setProjects(response.data);
      } catch {
        setError('Erro ao carregar os projetos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-500 text-lg">Carregando projetos...</p>;
    }

    if (error) {
      return <p className="text-red-500 text-lg">{error}</p>;
    }

    if (projects.length === 0) {
      return <p className="text-gray-500 text-lg">Nenhum projeto encontrado.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-2 truncate">{project.description}</p>
            <Link to={`/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors mt-4 inline-block font-semibold">
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meus Projetos</h1>
      <div className="min-h-[400px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}