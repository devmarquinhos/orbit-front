import { useState, useEffect, type FormEvent } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
}

const CreateProjectModal = ({ onClose, onProjectCreated }: { onClose: () => void, onProjectCreated: (newProject: Project) => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do projeto é obrigatório.');
      return;
    }
    try {
      const response = await api.post<Project>('/projects', { name, description });
      onProjectCreated(response.data);
    } catch {
      setError('Erro ao criar o projeto. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800 font-semibold px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get<Project[]>(`/projects/user/${user.id}`);
        setProjects(response.data);
      } catch {
        setError("Erro ao carregar os projetos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(currentProjects => [newProject, ...currentProjects]);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-500 text-lg">Carregando projetos...</p>;
    }

    if (error) {
      return <p className="text-red-500 text-lg">{error}</p>;
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Nenhum projeto encontrado.</p>
            <p className="text-gray-500 mt-2">Clique em "Novo Projeto" para começar.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-2 truncate">{project.description}</p>
            <Link
              to={`/projects/${project.id}`}
              className="text-indigo-600 hover:text-indigo-800 transition-colors mt-4 inline-block font-semibold"
            >
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 text-left">
          Meus Projetos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Novo Projeto
        </button>
      </div>

      <div className="flex items-center justify-center">
        {renderContent()}
      </div>

      {isModalOpen && (
        <CreateProjectModal
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}