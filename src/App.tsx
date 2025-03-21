
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './contexts/CartProvider';

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;
