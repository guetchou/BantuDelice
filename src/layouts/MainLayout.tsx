
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from '@/components/layout/MainNavbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
