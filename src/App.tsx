
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './contexts/CartProvider';

function App() {
  return (
    <CartProvider>
      {router}
    </CartProvider>
  );
}

export default App;
