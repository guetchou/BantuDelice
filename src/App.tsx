
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from './contexts/CartProvider';
import { OrderProvider } from './contexts/OrderContext';
import { AuthProvider } from './contexts/AuthContext';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
