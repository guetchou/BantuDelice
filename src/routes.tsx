
import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Wallet from "@/pages/Wallet";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import OrderTracking from "@/pages/OrderTracking";
import Taxi from "@/pages/Taxi";
import TaxiRide from "@/pages/TaxiRide";
import Notifications from "@/pages/Notifications";
import Favorites from "@/pages/Favorites";
import Covoiturage from "@/pages/Covoiturage";
import Dashboard from "@/pages/Dashboard";
import Loyalty from "@/pages/Loyalty";
import ReferralProgram from "@/pages/ReferralProgram";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Wallet and Payment routes
import Deposit from "@/pages/wallet/Deposit";
import Withdraw from "@/pages/wallet/Withdraw";
import PaymentMethods from "@/pages/wallet/PaymentMethods";
import Transactions from "@/pages/wallet/Transactions";
import Invoices from "@/pages/wallet/Invoices";
import Analytics from "@/pages/wallet/Analytics";

// Admin dashboard routes
import AdminDashboard from "@/pages/admin/Dashboard";
import RestaurantDashboard from "@/pages/restaurant/Dashboard";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import DeliveryDashboard from "@/pages/delivery/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";

export default (
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="restaurants" element={<Restaurants />} />
    <Route path="restaurant/:id" element={<RestaurantMenu />} />
    <Route path="covoiturage" element={<Covoiturage />} />
    <Route path="auth" element={<Auth />} />
    <Route path="taxi" element={<Taxi />} />
    <Route path="taxi/ride/:id" element={<TaxiRide />} />
    
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="orders" element={<Orders />} />
      <Route path="order/:id" element={<OrderDetails />} />
      <Route path="order/tracking/:id" element={<OrderTracking />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="loyalty" element={<Loyalty />} />
      <Route path="referral" element={<ReferralProgram />} />
      
      {/* Wallet and Payment routes */}
      <Route path="wallet" element={<Wallet />} />
      <Route path="wallet/deposit" element={<Deposit />} />
      <Route path="wallet/withdraw" element={<Withdraw />} />
      <Route path="wallet/payment-methods" element={<PaymentMethods />} />
      <Route path="wallet/transactions" element={<Transactions />} />
      <Route path="wallet/invoices" element={<Invoices />} />
      <Route path="wallet/analytics" element={<Analytics />} />
      
      {/* Admin dashboard routes */}
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="restaurant/dashboard" element={<RestaurantDashboard />} />
      <Route path="kitchen/dashboard" element={<KitchenDashboard />} />
      <Route path="delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="analytics/dashboard" element={<AnalyticsDashboard />} />
    </Route>
  </Route>
);
