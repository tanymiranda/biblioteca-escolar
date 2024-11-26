import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  onSearch: (query: string) => void; 
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="flex justify-between items-center bg-gray-700 p-5 text-white">
      <title>Biblioteca Escolar</title>
      <Link href="/dashboard">
        <h1 className="text-white cursor-pointer">Biblioteca Escolar</h1>
      </Link>
      <div className="flex-grow px-5">
        <input
          type="text"
          placeholder="Pesquise livros aqui"
          className="w-full p-2 text-black text-base"
          onChange={(e) => onSearch(e.target.value)} 
        />
      </div>
      <div className="flex gap-2">
        <Link href="/livros">
          <button className="bg-white text-gray-900 border-none p-2 cursor-pointer text-base hover:bg-gray-200">
            Meus Livros
          </button>
        </Link>
        <Link href="/">
        <button className="bg-white text-gray-900 border-none p-2 cursor-pointer text-base hover:bg-gray-200">Sair</button>
      </Link>
      </div>
    </header>
  );
};

export default Header;
