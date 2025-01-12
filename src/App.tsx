import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { logger } from "./services/logger";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import Deposit from "./pages/wallet/Deposit";
import Withdraw from "./pages/wallet/Withdraw";
import Transactions from "./pages/wallet/Transactions";
import Invoices from "./pages/wallet/Invoices";
import PaymentMethods from "./pages/wallet/PaymentMethods";
import Analytics from "./pages/wallet/Analytics";
import Rewards from "./pages/loyalty/Rewards";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: any) => {
          logger.error("Erreur de requête", { error: error?.message });
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          logger.error("Erreur de mutation", { error: error?.message });
        },
      },
    },
  },
});

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    logger.info("Application démarrée");
    return () => {
      logger.info("Application arrêtée");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <ErrorBoundary>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={`pt-16 ${isCollapsed ? 'pl-20' : 'pl-64'} transition-all duration-300`}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
              
              {/* Routes protégées */}
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <Contacts isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deals"
                element={
                  <ProtectedRoute>
                    <Deals isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Nouvelles routes pour le portefeuille */}
              <Route
                path="/wallet/deposit"
                element={
                  <ProtectedRoute>
                    <Deposit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet/withdraw"
                element={
                  <ProtectedRoute>
                    <Withdraw />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet/invoices"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet/payment-methods"
                element={
                  <ProtectedRoute>
                    <PaymentMethods />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Route pour les récompenses */}
              <Route
                path="/loyalty/rewards"
                element={
                  <ProtectedRoute>
                    <Rewards />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </ErrorBoundary>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error("Erreur critique", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-gray-600 mb-4">Nous nous excusons pour la gêne occasionnée.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;