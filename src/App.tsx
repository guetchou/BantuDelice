
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from './contexts/CartProvider';

function App() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}

export default App;
