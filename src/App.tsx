
// We'll make minimal changes to the App component to use our new router
import AppRoutes from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { OfflineDetector } from "@/components/OfflineDetector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster />
      <OfflineDetector />
    </QueryClientProvider>
  );
}

export default App;
