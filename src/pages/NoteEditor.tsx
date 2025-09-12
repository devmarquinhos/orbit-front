import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";

import { useBlockNote } from "@blocknote/react";
import { darkDefaultTheme } from "@blocknote/mantine";
import { type Block } from "@blocknote/core";
import { type Theme } from "@blocknote/mantine";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { ArrowLeft, Save } from "lucide-react";

const darkTransparentTheme: Theme = {
  ...darkDefaultTheme,
  colors: {
    ...darkDefaultTheme.colors,
    editor: {
      text: "#E5E7EB",
      background: "transparent",
    },
  },
};

interface Note {
  id: number;
  projectNoteId: number;
  content: string;
}

const handleUpload = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        resolve(event.target.result);
      } else {
        reject(new Error("Falha ao ler o arquivo."));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

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

  const editor = useBlockNote({
    uploadFile: handleUpload,
  });

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
          }, 100);
        }
      }

      saveTimeout = setTimeout(handleSave, 1500);
    };

    editor.onEditorContentChange(handleContentChange);

    return () => {
      editor.onEditorContentChange(handleContentChange);
      clearTimeout(saveTimeout);
    };
  }, [editor, noteId]);

  if (loading) {
    return <p className="text-gray-400 text-center">Carregando editor...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="h-full">
      <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
        <div className="flex-shrink-0 pt-4 text-white">
          <div className="flex justify-between items-center mb-4">
            <Link
              to={`/projects/${projectId}`}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Voltar para o projeto
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 italic">{saveStatus}</span>
              <button
                onClick={handleSave}
                className="bg-[#5F4BB6] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4A3B9A] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6">
            {note ? `Nota #${note.projectNoteId}` : "Carregando..."}
          </h1>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto pb-[40vh]"
        >
          <BlockNoteView editor={editor} theme={darkTransparentTheme} />
        </div>
      </div>
    </div>
  );
}