"use client"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import Footer from "../components/Footer"
import CabecalhoAdm from "../components/cabecalhoAdm"
import Link from 'next/link';


export default function AdicionarLivro() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [imagem, setImagem] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: userData, error } = await supabase.auth.getUser();

      if (error || !userData?.user) {
        alert("Erro ao verificar usuário autenticado.");
        router.push("/dashboard"); // Redireciona para o dashboard caso o usuário não esteja autenticado
        return;
      }

      const userRole = userData.user?.app_metadata?.role;

      if (userRole !== "admin") {
        alert("Acesso negado. Apenas administradores podem adicionar livros.");
        router.push("/adicionar-livro"); // Redireciona para o dashboard se o usuário não for admin
      }
    };

    checkAdmin();
  }, [router]);

  const handleAdicionarLivro = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!titulo || !autor || !imagem) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const { error } = await supabase.from("livros").insert([
        { titulo, autor, imagem },
      ]);

      if (error) {
        setErrorMessage("Erro ao adicionar o livro: " + error.message);
        return;
      }

      setSuccessMessage("Livro adicionado com sucesso!");
      setTitulo("");
      setAutor("");
      setImagem("");
    } catch (err) {
      setErrorMessage(
        "Ocorreu um erro inesperado: " +
          (err instanceof Error ? err.message : "Erro desconhecido")
      );
    }
  };

  return (
    <>
    <CabecalhoAdm/>
    <div className="p-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Adicionar Livro</h2>
      {successMessage && <p className="text-green-800 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdicionarLivro();
        }}
        className="space-y-4"
      >
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded bg-gray-200"
          />
        </div>
        <div>
          <label>Autor:</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded bg-gray-200"
          />
        </div>
        <div>
          <label>Imagem (URL):</label>
          <input
            type="text"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded bg-gray-200"
          />
        </div>
        <button
          type="submit"
          className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200"
        >
          Adicionar Livro
        </button>
        <Link href="/lista-livros">
        <button className="bg-black m-3 text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200">
            Ver todos os livros
        </button>
        </Link>
      </form>
    </div>
    <Footer/>
    </>
  );
}