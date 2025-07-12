import React from 'react';

const Header = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Buntudelice</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#services" className="text-white/80 hover:text-white transition">Services</a>
            <a href="#about" className="text-white/80 hover:text-white transition">À propos</a>
            <a href="#contact" className="text-white/80 hover:text-white transition">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
