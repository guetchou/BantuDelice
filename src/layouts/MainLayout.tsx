
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
      <Toaster />
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default MainLayout;
