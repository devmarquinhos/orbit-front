import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { api } from '../services/api';

import { useBlockNote } from "@blocknote/react";
import { type Block } from "@blocknote/core";
import { BlockNoteView } from '@blocknote/mantine';
import "@blocknote/mantine/style.css";

import { ArrowLeft, Save } from 'lucide-react';

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
  const [saveStatus, setSaveStatus] = useState<string>('Pronto');

  const editor = useBlockNote({});

  useEffect(() => {
    if (!noteId || !editor) return;

    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await api.get<Note>(`/notes/${noteId}`);
        const fetchedNote = response.data;
        setNote(fetchedNote);

        if (fetchedNote.content) {
          try {
            const blocks: Block[] = JSON.parse(fetchedNote.content);
            editor.replaceBlocks(editor.topLevelBlocks, blocks);
          } catch (e) {
            console.error("Conteúdo da nota inválido:", e);
          }
        }
      } catch {
        setError("Não foi possível carregar a nota.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, editor]);

  const handleSave = async () => {
    if (!editor || !noteId) return;

    setSaveStatus('Salvando...');
    try {
      const contentJSON = JSON.stringify(editor.topLevelBlocks);
      await api.put(`/notes/${noteId}`, { content: contentJSON });
      setSaveStatus('Salvo ✅');
    } catch (err) {
      console.error("Falha ao salvar a nota:", err);
      setSaveStatus('Erro ao salvar ❌');
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center">Carregando editor...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto pt-4 text-left">
      <div className="flex justify-between items-center mb-4">
        <Link to={`/projects/${projectId}`} className="text-indigo-600 hover:underline">
          <ArrowLeft size={32} />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 italic">{saveStatus}</span>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            <Save size={24}/>
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {note ? `Editando a nota #${note.projectNoteId}` : 'Nota não encontrada'}
      </h1>

      <div className="bg-white rounded-lg shadow-md text-black p-6">
        <BlockNoteView editor={editor} theme={"light"} />
      </div>
    </div>
  );
}