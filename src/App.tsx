import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";
import Profile from "@/pages/Profile";
import { SidebarProvider } from "@/contexts/SidebarContext";
import NotificationBell from "@/components/NotificationBell";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";

const App = () => {
  return (
    <SidebarProvider>
      <NotificationBell />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/kitchen" element={<KitchenDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
      </Routes>
    </SidebarProvider>
  );
};

export default App;