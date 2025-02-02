import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LoyaltyProvider } from '@/contexts/LoyaltyContext';
import ChatSupport from '@/components/chat/ChatSupport';
import { RouterProvider } from "react-router-dom";
import { router } from './routes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LoyaltyProvider>
          <RouterProvider router={router} />
          <ChatSupport />
          <Toaster />
        </LoyaltyProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;