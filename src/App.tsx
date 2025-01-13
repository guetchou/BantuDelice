import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavigationProvider } from "@/contexts/NavigationContext";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import DeliveryDashboard from "@/pages/delivery/Dashboard";
import RestaurantDashboard from "@/pages/restaurant/Dashboard";

const App = () => {
  return (
    <Router>
      <NavigationProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </NavigationProvider>
    </Router>
  );
};

export default App;