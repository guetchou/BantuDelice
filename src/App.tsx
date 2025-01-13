import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <AppRoutes />
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;