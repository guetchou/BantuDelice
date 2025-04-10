
import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/hooks/useAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Root layout with providers
const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="buntudelice-ui-theme">
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Define routes
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <div className="p-8 text-center">Welcome to BuntuDelice!</div>,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      // Add other routes as needed
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}

// Import for the default export reference
import { RouterProvider } from 'react-router-dom';
