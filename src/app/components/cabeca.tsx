import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-gray-700 p-5 text-white">
      <title>Biblioteca Escolar</title>
      <Link href="/dashboard">
      <h1 className="text-3xl font-bold text-gray-200 text-left">Biblioteca Escolar</h1>
      </Link>
      <div className="flex gap-2">
      <Link href="/livros">
        <button className="bg-white text-gray-900 border-none p-2 cursor-pointer text-base hover:bg-gray-200">Meus Livros</button>
      </Link>
      <Link href="/">
        <button className="bg-white text-gray-900 border-none p-2 cursor-pointer text-base hover:bg-gray-200">Sair</button>
      </Link>
      </div>
    </header>
  );
};

export default Header;
