import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = 2;
        const response = await api.get(`/projects/user/${userId}`);
        setProjects(response.data);
      } catch {
        setError('Erro ao carregar os projetos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Carregando projetos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Projetos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <Link to={`/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors mt-4 inline-block">
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}