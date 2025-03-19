
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-primary/10">
      <header className="py-4 px-6 border-b">
        <Link to="/" className="text-xl font-bold">EazyCongo</Link>
      </header>
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {children || <Outlet />}
        </div>
      </div>
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EazyCongo. Tous droits réservés.
      </footer>
      <Toaster />
    </div>
  );
};
