import React from "react";
import Link from "next/link";

const CabecalhoAdm = () => {
  return (
    <header className="bg-gray-800 p-5 border-b-2 border-gray-600 shadow-md relative">
      <title>Biblioteca Escolar</title>

      <h1 className="text-3xl font-bold text-gray-100 text-center sm:text-left">
        Biblioteca Escolar
      </h1>

      <div className="absolute top-5 right-5 space-x-4">
        <Link href="/perfil-admin">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded shadow-md hover:bg-gray-200 transition duration-300 ease-in-out">
            Perfil
          </button>
        </Link>
        <Link href="/cadastro">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded shadow-md hover:bg-gray-200 transition duration-300 ease-in-out">
            Cadastrar Estudante
          </button>
        </Link>
      </div>
    </header>
  );
};

export default CabecalhoAdm;