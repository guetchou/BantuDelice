import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`pt-16 ${isCollapsed ? 'pl-20' : 'pl-64'} transition-all duration-300`}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
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
          </Routes>
        </div>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;