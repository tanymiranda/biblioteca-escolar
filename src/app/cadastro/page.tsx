"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import CabecalhoAdm from "../components/cabecalhoAdm";
import Footer from "../components/Footer";
import bcrypt from "bcryptjs";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
        alert("Acesso negado. Apenas administradores podem acessar esta página.");
        router.push("/dashboard"); // Redireciona para o dashboard se o usuário não for admin
      }
    };

    checkAdmin();
  }, [router]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nome || !serie || !email || !senha) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(senha, 10);

      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (authError) {
        setError("Erro ao criar usuário no Supabase Auth: " + authError.message);
        return;
      }

      const { error: insertError } = await supabase.from("usuarios").insert([
        {
          nome,
          serie,
          email,
          senha: hashedPassword,
          role: "usuario",
        },
      ]);

      if (insertError) {
        setError("Erro ao salvar dados na tabela 'usuarios': " + insertError.message);
        return;
      }

      setSuccess("Usuário cadastrado com sucesso!");
      setNome("");
      setSerie("");
      setEmail("");
      setSenha("");
    } catch (err) {
      if (err instanceof Error) {
        setError("Erro inesperado no cadastro: " + err.message);
      } else {
        setError("Erro inesperado no cadastro.");
      }
    }
  };

  return (
    <>
      <CabecalhoAdm />
      <div className="p-8 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 min-h-screen flex items-center justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-lg w-full border border-gray-300">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Cadastro de Estudante
          </h2>
          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCadastro(e);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-lg font-medium text-gray-800">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800">Série:</label>
              <input
                type="text"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800">E-mail:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800">Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out"
            >
              Cadastrar
            </button>
            <Link href="/adicionar-livro">
              <button className="w-full py-3 mt-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out">
                Voltar
              </button>
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}