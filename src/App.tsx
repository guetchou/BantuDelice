import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";
import NotificationBell from "@/components/NotificationBell";
import { SidebarProvider } from "@/contexts/SidebarContext";

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <NotificationBell />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </SidebarProvider>
    </Router>
  );
};

export default App;