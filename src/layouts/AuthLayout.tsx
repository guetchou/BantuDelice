
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default AuthLayout;
