
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './contexts/CartProvider';
import { NavigationProvider } from './contexts/NavigationContext';

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;
