import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";
import NotificationBell from "@/components/NotificationBell";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <NotificationBell />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/admin" 
          element={<Admin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />} 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />} 
        />
        <Route
          path="/kitchen"
          element={<KitchenDashboard isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
        />
        <Route
          path="/analytics"
          element={<AnalyticsDashboard isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;