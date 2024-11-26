"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import Footer from "../components/Footer"
import CabecalhoAdm from "../components/cabecalhoAdm";
import Link from 'next/link';

interface AdminData {
  nome: string;
  email: string;
  role: string;
}

export default function AdminProfile() {
  const [adminData, setAdminData] = useState<AdminData | null>(null); 
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data, error } = await supabase
          .from("usuarios")
          .select("id, nome, email, role")
          .eq("role", "admin")
          .single(); 

        if (error || !data) {
          setError("Administrador não encontrado ou acesso negado.");
          router.push("/login"); 
          return;
        }

        setAdminData(data); 
      } catch (err) {
        console.error("Erro ao buscar dados do administrador:", err);
        setError("Erro ao carregar os dados.");
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar:", error.message);
    } else {
      router.push("/login"); 
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!adminData) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <CabecalhoAdm />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Perfil do Administrador
          </h1>
          <div className="mb-4 text-lg text-gray-700">
            <p><strong>Nome:</strong> {adminData.nome}</p>
            <p><strong>Email:</strong> {adminData.email}</p>
            <p><strong>Papel:</strong> {adminData.role}</p>
          </div>
          <button
            onClick={() => router.push("/adicionar-livro")}
            className="w-full py-3 mt-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out"
          >
            Gerenciar Livros
          </button>
          <Link href="/">
          <button className="w-full py-3 mt-4 bg-gray-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out">
            Sair
          </button>
        </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}