
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from './contexts/CartProvider';
import { OrderProvider } from './contexts/OrderContext';

function App() {
  return (
    <OrderProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </OrderProvider>
  );
}

export default App;
