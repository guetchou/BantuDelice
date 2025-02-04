import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
        <Toaster />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;