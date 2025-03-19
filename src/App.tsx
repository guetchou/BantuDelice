
// We'll make minimal changes to the App component to use our new router
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { OfflineDetector } from "@/components/OfflineDetector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <OfflineDetector />
    </QueryClientProvider>
  );
}

export default App;
