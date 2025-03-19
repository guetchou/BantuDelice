
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Import pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import Favorites from "./pages/Favorites";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/wallet/Transactions";
import Loyalty from "./pages/Loyalty";
import Cashback from "./pages/Cashback";
import Taxi from "./pages/Taxi";
import TaxiRide from "./pages/TaxiRide";
import Notifications from "./pages/Notifications";
import Covoiturage from "./pages/Covoiturage";
import Explorer from "./pages/Explorer";
import Deals from "./pages/Deals";
import Help from "./pages/Help";
import ReferralProgram from "./pages/ReferralProgram";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import OrderDemo from "./pages/OrderDemo";
import ContactDetails from "./pages/ContactDetails";
import Contacts from "./pages/Contacts";
import Messages from "./pages/Messages";
import Specialties from "./pages/Specialties";
import Legal from "./pages/Legal";
import FeatureFlags from "./pages/FeatureFlags";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFeatureFlags from "./pages/admin/FeatureFlags";

// Analytics pages
import AnalyticsDashboard from "./pages/analytics/Dashboard";

// Delivery pages
import DeliveryDashboard from "./pages/delivery/Dashboard";

// Kitchen pages
import KitchenDashboard from "./pages/kitchen/Dashboard";

// Restaurant pages
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantManagement from "./pages/restaurant/ManagementPage";
import RestaurantSubscriptionPlans from "./pages/restaurant/SubscriptionPlans";

// Driver pages
import DriverSubscriptionPlans from "./pages/driver/SubscriptionPlans";

// Subscription pages
import SubscriptionCheckout from "./pages/subscription/Checkout";

// Loyalty pages
import LoyaltyRewards from "./pages/loyalty/Rewards";

// Taxi pages
import TaxiBooking from "./pages/taxi/Booking";
import TaxiRideStatus from "./pages/taxi/RideStatus";

// Wallet pages
import WalletAnalytics from "./pages/wallet/Analytics";
import WalletDeposit from "./pages/wallet/Deposit";
import WalletWithdraw from "./pages/wallet/Withdraw";
import WalletPaymentMethods from "./pages/wallet/PaymentMethods";
import WalletInvoices from "./pages/wallet/Invoices";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Erreur 404 - Page non trouvée</div>,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "restaurants",
        element: <Restaurants />,
      },
      {
        path: "restaurants/:id",
        element: <RestaurantMenu />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-tracking/:id",
        element: <OrderTracking />,
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet",
        element: (
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/analytics",
        element: (
          <ProtectedRoute>
            <WalletAnalytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/deposit",
        element: (
          <ProtectedRoute>
            <WalletDeposit />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/withdraw",
        element: (
          <ProtectedRoute>
            <WalletWithdraw />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/payment-methods",
        element: (
          <ProtectedRoute>
            <WalletPaymentMethods />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet/invoices",
        element: (
          <ProtectedRoute>
            <WalletInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "loyalty",
        element: (
          <ProtectedRoute>
            <Loyalty />
          </ProtectedRoute>
        ),
      },
      {
        path: "cashback",
        element: (
          <ProtectedRoute>
            <Cashback />
          </ProtectedRoute>
        ),
      },
      {
        path: "taxi",
        element: <Taxi />,
      },
      {
        path: "taxi/:id",
        element: <TaxiRide />,
      },
      {
        path: "taxi/booking",
        element: <TaxiBooking />,
      },
      {
        path: "taxi/ride/:id",
        element: <TaxiRideStatus />,
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "covoiturage",
        element: <Covoiturage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "explorer",
        element: <Explorer />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "referral",
        element: (
          <ProtectedRoute>
            <ReferralProgram />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/features",
        element: (
          <ProtectedRoute>
            <AdminFeatureFlags />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics/dashboard",
        element: (
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "delivery/dashboard",
        element: (
          <ProtectedRoute>
            <DeliveryDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "kitchen/dashboard",
        element: (
          <ProtectedRoute>
            <KitchenDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "restaurant/dashboard",
        element: (
          <ProtectedRoute>
            <RestaurantDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "restaurant/management",
        element: (
          <ProtectedRoute>
            <RestaurantManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "restaurant/subscription",
        element: (
          <ProtectedRoute>
            <RestaurantSubscriptionPlans />
          </ProtectedRoute>
        ),
      },
      {
        path: "driver/subscription",
        element: (
          <ProtectedRoute>
            <DriverSubscriptionPlans />
          </ProtectedRoute>
        ),
      },
      {
        path: "subscription/checkout",
        element: (
          <ProtectedRoute>
            <SubscriptionCheckout />
          </ProtectedRoute>
        ),
      },
      {
        path: "loyalty/rewards",
        element: (
          <ProtectedRoute>
            <LoyaltyRewards />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-demo",
        element: <OrderDemo />,
      },
      {
        path: "contact-details",
        element: <ContactDetails />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "specialties",
        element: <Specialties />,
      },
      {
        path: "legal",
        element: <Legal />,
      },
      {
        path: "feature-flags",
        element: <FeatureFlags />,
      },
    ],
  },
]);

export default router;
