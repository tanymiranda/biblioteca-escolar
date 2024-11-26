"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import bcrypt from "bcryptjs"; 
import Footer from "./components/Footer"
import Cabecalho from "./components/cabecalho"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !senha) {
      setError('E-mail e senha são obrigatórios.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, senha, role') 
        .eq('email', email)
        .single(); 

      if (error) {
        setError('E-mail não encontrado.');
        return;
      }

      const isPasswordValid = await bcrypt.compare(senha, data.senha);
      if (!isPasswordValid) {
        setError('Senha inválida.');
        return;
      }

      const role = data.role.toLowerCase();
      if (role === 'admin') {
        setSuccess('Login bem-sucedido! Redirecionando para o painel do admin...');
        router.push('/adicionar-livro'); 
      } else if (role === 'usuario') {
        setSuccess('Login bem-sucedido! Redirecionando...');
        router.push('/dashboard'); 
      } else {
        setError('Papel do usuário não reconhecido.');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError('Erro ao processar o login.');
    }
  };

  return (
    <>
    <Cabecalho/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      {success && <p className="text-green-700">{success}</p>}

      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Senha:</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 cursor-pointer text-base transition duration-300 ease-in-out hover:bg-gray-600 hover:text-gray-200"
        >
          Entrar
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
}