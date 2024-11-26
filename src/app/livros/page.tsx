"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Cabeca from "../components/cabeca";

export default function LivroDetalhesPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); //

  const [livros, setLivros] = useState<any[]>([]);

  useEffect(() => {
    const livrosSalvos = localStorage.getItem("livrosSolicitados");
    if (livrosSalvos) {
      setLivros(JSON.parse(livrosSalvos));
    } else {
      setLivros([]);
    }
  }, []);

  useEffect(() => {
    if (livros.length > 0) {
      localStorage.setItem("livrosSolicitados", JSON.stringify(livros));
    }
  }, [livros]);

  function calculateFutureDate(days: number, fromDate: string = new Date().toISOString().slice(0, 10)) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  const handleRenovar = (livroId: number) => {
    setLivros((prevLivros) =>
      prevLivros.map((livro) => {
        if (livro.id === livroId) {
          const hoje = new Date();
          const dataDevolucao = new Date(livro.dataDevolucao);

          const diasDesdeDevolucao = Math.floor(
            (hoje.getTime() - dataDevolucao.getTime()) / (1000 * 60 * 60 * 24)          // Calcula a diferença em dias
          );

          if (diasDesdeDevolucao < 5) {
            alert(`Você só pode renovar o empréstimo após 5 dias. Dias restantes: ${5 - diasDesdeDevolucao}`);
            return livro;
          }

          return {
            ...livro,
            renovacoes: livro.renovacoes + 1,
            dataDevolucao: calculateFutureDate(5, livro.dataDevolucao),
          };
        }
        return livro;
      })
    );
  };

  return (
    <>
      <Cabeca />
      <div className="flex flex-col items-center p-6 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 min-h-screen">
        <h1 className="text-2xl font-semibold mb-5">Detalhes dos Livros</h1>

        <div className="w-full max-w-md">
          {livros.length > 0 ? (
            livros.map((livro) => (
              <div key={livro.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-4">
                {livro.imagem && (
                  <img
                    src={livro.imagem}
                    alt={`Imagem de ${livro.titulo}`}
                    className="w-full h-64 object-cover mb-3 rounded-md"
                  />
                )}
                <h2 className="text-lg font-semibold">{livro.titulo}</h2>
                <p className="text-gray-700">Autor: {livro.autor}</p>
                <p className="text-gray-700">Data de Devolução: {livro.dataDevolucao}</p>
                <p className="text-gray-500">Renovações: {livro.renovacoes} de 2</p>
                <button
                  onClick={() => handleRenovar(livro.id)}
                  disabled={livro.renovacoes >= 2}
                  className={`mt-3 px-4 py-2 text-white rounded ${
                    livro.renovacoes < 2
                      ? "bg-gray-900 hover:bg-gray-600 hover:text-gray-200"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {livro.renovacoes < 2 ? "Renovar Empréstimo" : "Máximo de Renovações"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Você ainda não solicitou nenhum livro.</p>
          )}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-5 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Ver novos livros
        </button>
      </div>
      <Footer />
    </>
  );
}