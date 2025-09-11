import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { api } from '../services/api';
interface Note {
  id: number;
  projectNoteId: number;
  content: string;
}

export default function NoteEditor() {
  const { projectId, noteId } = useParams<{ projectId: string; noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        setError("ID da nota não encontrado.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get<Note>(`/notes/${noteId}`);
        setNote(response.data);
      } catch {
        setError("Não foi possível carregar a nota.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) {
    return <p className="text-gray-500">Carregando nota...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="mb-4">
        <Link to={`/projects/${projectId}`} className="text-indigo-600 hover:underline">
          &larr; Voltar para o projeto
        </Link>
      </div>
 
      <h1 className="text-2xl font-bold">
        {note ? `Editando a nota #${note.projectNoteId}` : 'Nota não encontrada'}
      </h1>
      <p className="mt-4">O blocknote vai aqui</p>
    </div>
  );
}