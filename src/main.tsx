
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ApiAuthProvider } from './contexts/ApiAuthContext';
import { AuthProvider } from './contexts/AuthContext';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ApiAuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ApiAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
