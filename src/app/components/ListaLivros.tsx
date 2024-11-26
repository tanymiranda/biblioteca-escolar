"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from 'next/link';

export default function ListaLivros() {
  const [livros, setLivros] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [livroEditando, setLivroEditando] = useState<any | null>(null); 
  const [titulo, setTitulo] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [imagem, setImagem] = useState<string>("");

  useEffect(() => {
    const fetchLivros = async () => {
      const { data, error } = await supabase.from("livros").select("*");

      if (error) {
        setErrorMessage("Erro ao buscar livros: " + error.message);
      } else {
        setLivros(data);
      }
    };

    fetchLivros();
  }, []);

  const handleEdit = (livro: any) => {
    setLivroEditando(livro); 
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setImagem(livro.imagem);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
      const { error } = await supabase.from("livros").delete().eq("id", id);

      if (error) {
        setErrorMessage("Erro ao excluir livro: " + error.message);
      } else {
        setLivros(livros.filter((livro) => livro.id !== id));
      }
    }
  };

  const handleSalvarAlteracoes = async () => {
    if (!titulo || !autor || !imagem) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("livros")
        .update({ titulo, autor, imagem })
        .eq("id", livroEditando.id)  
  
      if (error) {
        setErrorMessage("Erro ao editar o livro: " + error.message);
        console.error("Erro ao atualizar livro:", error.message);
      } else {
        setLivros(livros.map((livro) =>
          livro.id === livroEditando.id ? { ...livro, titulo, autor, imagem } : livro
        ));
        setLivroEditando(null);  
      }
    } catch (err) {
      setErrorMessage(
        "Ocorreu um erro inesperado: " + (err instanceof Error ? err.message : "Erro desconhecido")
      );
      console.error("Erro inesperado:", err);
    }
  };
  

  return (
    <>
    <div className="p-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400">
      <h2 className="text-xl font-semibold mb-4">Lista de Livros</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <table className="min-w-full border-collapse border-2 border-solid border-gray-600 bg-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 border-gray-600">Título</th>
            <th className="border px-4 py-2 border-gray-600">Autor</th>
            <th className="border px-4 py-2 border-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro) => (
            <tr key={livro.id}>
              <td className="border px-4 py-2 border-gray-600">{livro.titulo}</td>
              <td className="border px-4 py-2 border-gray-600">{livro.autor}</td>
              <td className="border px-4 py-2 border-gray-600">
                <button
                  onClick={() => handleEdit(livro)}
                  className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(livro.id)}
                  className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {livroEditando && (
        <div className="mt-6 p-5 bg-white border rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Editar Livro</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvarAlteracoes();
            }}
            className="space-y-4"
          >
            <div>
              <label>Título:</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded"
              />
            </div>
            <div>
              <label>Autor:</label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded"
              />
            </div>
            <div>
              <label>Imagem (URL):</label>
              <input
                type="text"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => setLivroEditando(null)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
    <div className=" bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400">
      <Link href="/adicionar-livro">
        <button className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200">
            Adicionar Novos Livros
        </button>
      </Link>
      </div>
    </>
  );
}
