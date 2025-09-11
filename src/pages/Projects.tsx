import { useState, useEffect, type FormEvent } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

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
      onClose();
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
            <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
            <input
              id="create-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="create-description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="create-description"
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

const EditProjectModal = ({ project, onClose, onProjectUpdated }: { project: Project, onClose: () => void, onProjectUpdated: (updatedProject: Project) => void }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do projeto é obrigatório.');
      return;
    }
    try {
      const response = await api.put<Project>(`/projects/${project.id}`, { name, description });
      onProjectUpdated(response.data);
      onClose();
    } catch {
      setError('Erro ao atualizar o projeto. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="edit-description"
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
              Salvar Alterações
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
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(currentProjects =>
      currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const handleProjectDeleted = async (projectId: number) => {
    if (!window.confirm("Tem certeza que deseja apagar este projeto e todas as suas notas?")) {
      return;
    }
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(currentProjects => currentProjects.filter(p => p.id !== projectId));
    } catch {
      setError("Erro ao apagar o projeto. Tente novamente.");
    }
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
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
              {/* === CORREÇÃO APLICADA AQUI === */}
              {/* Trocamos 'truncate' por 'line-clamp-3' */}
              <p className="text-gray-600 mt-2 break-words line-clamp-3">{project.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/projects/${project.id}`}
                className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
              >
                Ver notas
              </Link>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingProject(project)} className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleProjectDeleted(project.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
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
          onClick={() => setCreateModalOpen(true)}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Novo Projeto
        </button>
      </div>

      <div className="flex items-center justify-center">
        {renderContent()}
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setCreateModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </div>
  );
}