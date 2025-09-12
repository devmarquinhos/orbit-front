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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900/60 backdrop-blur-md rounded-lg border border-white/10 shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="create-name" className="block text-sm font-medium text-gray-300 mb-1">Nome do Projeto</label>
            <input
              id="create-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="create-description" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              id="create-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-300 hover:text-white font-semibold px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="bg-[#5F4BB6] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4A3B9A] transition-colors">
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
    <div className="fixed inset-0 bg-black bg-opacity-2 flex items-center justify-center z-50">
      <div className="bg-gray-900/60 backdrop-blur-md rounded-lg border border-white/10 shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Editar Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">Nome do Projeto</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-[#5F4BB6] focus:border-[#5F4BB6] text-white"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-300 hover:text-white font-semibold px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="bg-[#5F4BB6] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4A3B9A] transition-colors">
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
            className="bg-gray-900/40 backdrop-blur-md rounded-lg p-6 text-left flex flex-col border border-white/10 shadow-lg"
          >
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <p className="text-gray-400 mt-2 line-clamp-3 break-words">{project.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
              <Link
                to={`/projects/${project.id}`}
                className="text-[#9888E6] hover:text-white transition-colors font-semibold"
              >
                Ver notas
              </Link>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingProject(project)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleProjectDeleted(project.id)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
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
        <h1 className="text-4xl font-bold text-white text-left">
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