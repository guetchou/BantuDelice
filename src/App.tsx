
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import router from './routes';
import { NavigationProvider } from './contexts/NavigationContext';

function App() {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Check for dark mode preference on initial load
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <NavigationProvider>
      <RouterProvider router={router} />
    </NavigationProvider>
  );
}

export default App;
