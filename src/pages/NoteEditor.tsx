import { useParams, Link } from "react-router-dom";

export default function NoteEditor(){
    const { projectId, noteId } = useParams();

    return (
        <div className="container mx-auto pt-4">
            <div className="mb-4">
                <Link to={`/projects/${projectId}`} className="text-indigo-600 hover:underline">
                    &larr; Voltar para o projeto
                </Link>
            </div>
            <h1 className="text-2xl font-bold">Editando a nota #{noteId}</h1>
            <p className="mt-4">O blocknote vai aqui</p>
        </div>
    )
}