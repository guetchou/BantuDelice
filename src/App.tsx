
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LoyaltyProvider } from '@/contexts/LoyaltyContext';
import { Toaster } from "@/components/ui/toaster";
import { router } from './routes';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <LoyaltyProvider>
        <OrderProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster />
          </CartProvider>
        </OrderProvider>
      </LoyaltyProvider>
    </NotificationProvider>
  );
}

export default App;
