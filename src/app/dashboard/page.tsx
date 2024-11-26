"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardPage() {
  const router = useRouter(); 
  
  const [livros, setLivros] = useState<
    Array<{ id: number; titulo: string; autor: string; imagem: string }>
  >([]);
  const [filteredLivros, setFilteredLivros] = useState(livros);

  useEffect(() => {
    const fetchLivros = async () => {
      const { data, error } = await supabase.from("livros").select("*");

      if (error) {
        console.error("Erro ao buscar livros:", error.message);
      } else {
        setLivros(data);
        setFilteredLivros(data); // Inicializa com todos os livros
      }
    };

    fetchLivros();
  }, []);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results = livros.filter(
      (livro) =>
        livro.titulo.toLowerCase().includes(lowerQuery) ||
        livro.autor.toLowerCase().includes(lowerQuery)
    );
    setFilteredLivros(results); 
  };

  const handleSolicitarEmprestimo = (livro: { id: number; titulo: string; autor: string; imagem: string }) => {
    const livrosSolicitados = localStorage.getItem("livrosSolicitados");
    let livrosAtualizados = livrosSolicitados ? JSON.parse(livrosSolicitados) : [];

    livrosAtualizados.push({
      ...livro,
      renovacoes: 0,
      dataDevolucao: new Date().toISOString().slice(0, 10), 
    });

    localStorage.setItem("livrosSolicitados", JSON.stringify(livrosAtualizados));
    router.push(
      `/livros?id=${livro.id}&titulo=${encodeURIComponent(livro.titulo)}&autor=${encodeURIComponent(
        livro.autor
      )}&imagem=${encodeURIComponent(livro.imagem)}`
    );
  };

  return (
    <div className="bg-white text-gray-700">
      <Header onSearch={handleSearch} />
      <div className="p-5 bg-gray-200">
        <h2 className="text-3xl text-center mb-8 font-semibold text-gray-800">Livros Disponíveis</h2>
        <div className="flex flex-wrap gap-5 justify-center">
          {filteredLivros.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum livro encontrado para sua pesquisa.
            </p>
          ) : (
            filteredLivros.map((livro) => (
              <div
                key={livro.id}
                className="border border-gray-500 rounded-lg bg-gray-100 text-center p-4 shadow-lg flex flex-col justify-start items-center h-full max-w-xs"
              >
                <img
                  src={livro.imagem}
                  alt={livro.titulo}
                  className="w-full h-64 object-cover mb-4 rounded-md"
                />
                <h3 className="font-semibold text-xl text-gray-800">{livro.titulo}</h3>
                <p className="text-gray-600 mb-4">Autor: {livro.autor}</p>
                <button
                  onClick={() => handleSolicitarEmprestimo(livro)}
                  className="bg-gray-800 text-white border-none px-4 py-2 rounded cursor-pointer transition duration-300 w-full hover:bg-gray-500 mt-auto"
                >
                  Solicitar Empréstimo
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}