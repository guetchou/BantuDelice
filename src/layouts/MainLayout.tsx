
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};
