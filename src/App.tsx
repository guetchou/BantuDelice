
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import router from './routes';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="eazy-congo-theme">
      <NavigationProvider>
        <RouterProvider router={router} />
        <Toaster />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
