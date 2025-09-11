import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";

import { useBlockNote } from "@blocknote/react";
import { lightDefaultTheme } from "@blocknote/mantine";
import { type Block } from "@blocknote/core";
import { type Theme } from "@blocknote/mantine";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { ArrowLeft, Save } from "lucide-react";

const transparentTheme: Theme = {
  ...lightDefaultTheme,
  colors: {
    ...lightDefaultTheme.colors,
    editor: {
      ...lightDefaultTheme.colors.editor,
      background: "transparent",
    },
  },
};

interface Note {
  id: number;
  projectNoteId: number;
  content: string;
}

export default function NoteEditor() {
  const { projectId, noteId } = useParams<{
    projectId: string;
    noteId: string;
  }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("Pronto");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    setSaveStatus("Salvando...");
    try {
      const contentJSON = JSON.stringify(editor.topLevelBlocks);
      await api.put(`/notes/${noteId}`, { content: contentJSON });
      setSaveStatus("Salvo ✅");
    } catch (err) {
      console.error("Falha ao salvar a nota:", err);
      setSaveStatus("Erro ao salvar ❌");
    }
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    let saveTimeout: number;

    const handleContentChange = () => {
      // Limpa o timer anterior
      clearTimeout(saveTimeout);

      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const isNearBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100;

        if (isNearBottom) {
          setTimeout(() => {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: "smooth",
            });
          }, 100); // Um pequeno delay pode ajudar a rolagem a ser mais precisa
        }
      }

      // Agenda um novo salvamento
      saveTimeout = setTimeout(async () => {
        // === CORREÇÃO APLICADA AQUI ===
        // O status "Salvando..." só é definido QUANDO o salvamento vai de fato acontecer
        setSaveStatus("Salvando...");
        if (!noteId) return;

        try {
          const contentJSON = JSON.stringify(editor.topLevelBlocks);
          await api.put(`/notes/${noteId}`, { content: contentJSON });
          setSaveStatus("Salvo ✅");
        } catch (err) {
          console.error("Falha ao salvar a nota:", err);
          setSaveStatus("Erro ao salvar ❌");
        }
      }, 1500);
    };

    editor.onEditorContentChange(handleContentChange);

    return () => {
      editor.onEditorContentChange(handleContentChange);
      clearTimeout(saveTimeout);
    };
  }, [editor, noteId]);

  if (loading) {
    return <p className="text-gray-500 text-center">Carregando editor...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="h-full">
      <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="flex-shrink-0 pt-4 text-gray-800">
          <div className="flex justify-between items-center mb-4">
            <Link
              to={`/projects/${projectId}`}
              className="text-indigo-600 hover:underline flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Voltar para o projeto
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 italic">{saveStatus}</span>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Salvar Nota
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6">
            {note ? `Nota #${note.projectNoteId}` : "Carregando..."}
          </h1>
        </div>

        {/* Importando o blocknote */}
        <div
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto pb-[40vh]"
        >
          <BlockNoteView editor={editor} theme={transparentTheme} />
        </div>
      </div>
    </div>
  );
}
