import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { PlusCircle, Trash2 } from "lucide-react";

interface Note {
  id: number;
  projectNoteId: number;
  content: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  notes: Note[];
}

export default function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) {
        setLoading(false);
        setError("ID do projeto não encontrado.");
        return;
      }

      try {
        const response = await api.get<Project>(`/projects/${id}`);
        setProject(response.data);
      } catch {
        setError("Erro ao carregar os detalhes do projeto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleCreateNote = async () => {
    if (!id) return;

    try {
      const response = await api.post(`/notes/project/${id}`, {
        content: "",
      });
      const newNote = response.data;

      navigate(`/projects/${id}/notes/${newNote.id}`);
    } catch {
      setError("Erro ao criar a nova nota. Tente novamente.");
    }
  };

  const handleDeleteNote = async (noteIdToDelete: number) => {
    if (
      !window.confirm(
        `Tem certeza que deseja apagar a nota #${noteIdToDelete}?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/notes/${noteIdToDelete}`);

      setProject((currentProject) => {
        if (!currentProject) return null;
        return {
          ...currentProject,
          notes: currentProject.notes.filter(
            (note) => note.id !== noteIdToDelete
          ),
        };
      });
    } catch {
      setError("Erro ao apagar a nota. Tente novamente.");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center">Carregando...</p>;
  }

  if (error || !project) {
    return (
      <p className="text-red-500 text-center">
        {error || "Projeto não encontrado."}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Sobre o Projeto */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{project.description}</p>
      </div>

      {/* Notas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Notas</h2>
          <button
            onClick={handleCreateNote}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {project.notes.length === 0 ? (
          <div className="text-center py-10 border-t">
            <p className="text-gray-500">
              Nenhuma nota encontrada para este projeto.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 border-t pt-4">
            {project.notes.map((note) => (
                       <li
                key={note.id}
                className="group relative flex items-center justify-between p-4 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200"
              >
                <Link
                  to={`/projects/${project.id}/notes/${note.id}`}
                  className="font-medium text-gray-800 flex-1 py-1 pr-10"
                >
                  Nota #{note.projectNoteId}
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Apagar nota ${note.projectNoteId}`}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
