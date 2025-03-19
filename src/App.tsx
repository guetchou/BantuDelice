
import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import LiveChat from './components/chat/LiveChat';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { LoyaltyProvider } from './contexts/LoyaltyContext';

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="food-delivery-theme">
      <LoyaltyProvider>
        <Routes />
        <Toaster position="top-right" richColors />
        <LiveChat />
      </LoyaltyProvider>
    </ThemeProvider>
  );
};

export default App;
