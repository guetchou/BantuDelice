import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import DeliveryDashboard from "@/pages/delivery/Dashboard";
import RestaurantDashboard from "@/pages/restaurant/Dashboard";
import Specialties from "@/pages/Specialties";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/specialties" element={<Specialties />} />
      <Route path="/menu/:restaurantId" element={<RestaurantMenu />} />
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
  );
};

export default AppRoutes;