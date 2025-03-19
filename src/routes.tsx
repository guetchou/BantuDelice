
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import FeatureFlags from "@/pages/FeatureFlags";

// Wallet and Payment routes
import Deposit from "@/pages/wallet/Deposit";
import Withdraw from "@/pages/wallet/Withdraw";
import PaymentMethods from "@/pages/wallet/PaymentMethods";
import Transactions from "@/pages/wallet/Transactions";
import Invoices from "@/pages/wallet/Invoices";
import Analytics from "@/pages/wallet/Analytics";

// Admin dashboard routes
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminFeatureFlags from "@/pages/admin/FeatureFlags";
import RestaurantDashboard from "@/pages/restaurant/Dashboard";
import KitchenDashboard from "@/pages/kitchen/Dashboard";
import DeliveryDashboard from "@/pages/delivery/Dashboard";
import AnalyticsDashboard from "@/pages/analytics/Dashboard";

// New subscription routes
import RestaurantSubscriptionPlans from "@/pages/restaurant/SubscriptionPlans";
import DriverSubscriptionPlans from "@/pages/driver/SubscriptionPlans";
import SubscriptionCheckout from "@/pages/subscription/Checkout";
import { useFeatureFlags } from "@/utils/featureFlags";

// Create a component to handle route rendering with feature flags
const AppRoutes = () => {
  const isFeatureEnabled = useFeatureFlags(state => state.isEnabled);
  
  // Define routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorBoundary><div>Page not found</div></ErrorBoundary>,
      children: [
        { index: true, element: <Home /> },
        { path: "restaurants", element: <Restaurants /> },
        { path: "restaurant/:id", element: <RestaurantMenu /> },
        { path: "covoiturage", element: <Covoiturage /> },
        { path: "auth", element: <Auth /> },
        { path: "taxi", element: <Taxi /> },
        { path: "taxi/ride/:id", element: <TaxiRide /> },
        
        // Subscription routes - with feature flag check
        ...(isFeatureEnabled('premium_subscription') ? [
          { path: "restaurant/subscription/plans", element: <RestaurantSubscriptionPlans /> },
          { path: "driver/subscription/plans", element: <DriverSubscriptionPlans /> },
          { path: "restaurant/subscription/checkout/:planId", element: <SubscriptionCheckout /> },
          { path: "driver/subscription/checkout/:planId", element: <SubscriptionCheckout /> },
        ] : []),
        
        // Protected Routes
        {
          element: <ProtectedRoute children={undefined} />,
          children: [
            { path: "orders", element: <Orders /> },
            { path: "order/:id", element: <OrderDetails /> },
            { path: "order/tracking/:id", element: <OrderTracking /> },
            { path: "profile", element: <Profile /> },
            { path: "settings", element: <Settings /> },
            { path: "notifications", element: <Notifications /> },
            { path: "favorites", element: <Favorites /> },
            { path: "dashboard", element: <Dashboard /> },
            
            // Loyalty - with feature flag check
            ...(isFeatureEnabled('loyalty_points') ? [
              { path: "loyalty", element: <Loyalty /> },
            ] : []),
            
            // Referral - with feature flag check
            ...(isFeatureEnabled('referral_program') ? [
              { path: "referral", element: <ReferralProgram /> },
            ] : []),
            
            // Wallet and Payment routes - with feature flag check
            ...(isFeatureEnabled('wallet_management') ? [
              { path: "wallet", element: <Wallet /> },
              { path: "wallet/deposit", element: <Deposit /> },
              { path: "wallet/withdraw", element: <Withdraw /> },
              { path: "wallet/payment-methods", element: <PaymentMethods /> },
              { path: "wallet/transactions", element: <Transactions /> },
              { path: "wallet/invoices", element: <Invoices /> },
              { path: "wallet/analytics", element: <Analytics /> },
            ] : []),
            
            // Admin dashboard routes
            { path: "admin", element: <AdminDashboard /> },
            { path: "admin/feature-flags", element: <AdminFeatureFlags /> },
            { path: "restaurant/dashboard", element: <RestaurantDashboard /> },
            { path: "kitchen/dashboard", element: <KitchenDashboard /> },
            { path: "delivery/dashboard", element: <DeliveryDashboard /> },
            { path: "analytics/dashboard", element: <AnalyticsDashboard /> },
          ]
        }
      ]
    }
  ]);
  
  return <RouterProvider router={router} />;
};

export default AppRoutes;
