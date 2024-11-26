"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ListaLivros from "@/app/components/ListaLivros";
import Footer from "../components/Footer";
import CabecalhoAdm from "../components/cabecalhoAdm";
import { supabase } from "@/utils/supabaseClient";

export default function Page() {
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
        router.push("/dashboard"); 
      }
    };

    checkAdmin();
  }, [router]);

  return (
    <>
      <CabecalhoAdm />
      <ListaLivros />
      <Footer />
    </>
  );
}
