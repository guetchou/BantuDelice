import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ApiAuthProvider } from './contexts/ApiAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartProvider';

const App = () => {
  console.log('🔍 App.tsx rendering...');
  
  return (
    <>
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundImage: `url('/images/thedrop24BG.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        filter: 'blur(0px) brightness(0.95)'
      }} aria-hidden="true" />
      <ThemeProvider defaultTheme="light" storageKey="buntudelice-ui-theme">
        <ApiAuthProvider>
          <AuthProvider>
            <CartProvider>
              <div className="glass-effect min-h-screen min-w-full">
                <Outlet />
              </div>
            </CartProvider>
          </AuthProvider>
        </ApiAuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
