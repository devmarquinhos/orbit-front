import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FolderKanban, FileText, ImageDown } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const ctaLink = isAuthenticated ? "/projects" : "/register";
  const ctaText = isAuthenticated ? "Acessar meus projetos" : "Comece agora, é grátis";

  return (
    <div className="mx-auto w-full max-w-4xl pt-4 text-left">
      {/* Seção Principal (Hero) com cores para o dark mode */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Organize suas ideias em uma órbita.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Orbit é o seu espaço central para gerenciar projetos, tomar notas ricas e manter tudo sincronizado em um só lugar.
        </p>
        <Link
          to={ctaLink}
          className="mt-8 inline-block bg-[#5F4BB6] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#4A3B9A] transition-colors text-lg"
        >
          {ctaText}
        </Link>
      </div>

      {/* Seção de Funcionalidades com cores para o dark mode */}
      <div className="py-16 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#5F4BB6]/10 p-4 rounded-full border border-[#5F4BB6]/20">
                <FolderKanban className="w-8 h-8 text-[#5F4BB6]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Projetos Centralizados</h3>
            <p className="text-gray-400 mt-2">
              Agrupe suas notas e tarefas em projetos claros e objetivos. Tenha uma visão macro de tudo o que está acontecendo.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#5F4BB6]/10 p-4 rounded-full border border-[#5F4BB6]/20">
                <FileText className="w-8 h-8 text-[#5F4BB6]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Notas com Rich Text</h3>
            <p className="text-gray-400 mt-2">
              Utilize um editor de texto moderno, inspirado no Obsidian, para formatar suas ideias com cabeçalhos, listas e mais.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#5F4BB6]/10 p-4 rounded-full border border-[#5F4BB6]/20">
                <ImageDown className="w-8 h-8 text-[#5F4BB6]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white">Upload de Imagens</h3>
            <p className="text-gray-400 mt-2">
              Cole prints e imagens diretamente em suas notas. O conteúdo visual é salvo junto com o seu texto.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}