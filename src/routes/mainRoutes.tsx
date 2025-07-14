import Index from "@/pages/Index";
import ColisServicePage from "@/pages/ColisServicePage";
import DeliveryPage from "@/pages/delivery";
import MapPage from "@/pages/delivery/MapPage";
import OrderPage from "@/pages/OrderPage";
import AuthPage from "@/pages/AuthPage";
import UserProfile from "@/components/UserProfile";
import UserOrders from "@/components/UserOrders";
import PaymentHistory from "@/components/payment/PaymentHistory";
import LocationPage from "@/pages/LocationPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import App from "@/App";
import Services from "@/pages/Services";
import Restaurants from "@/pages/Restaurants";
import Taxi from "@/pages/Taxi";
import TaxiBooking from "@/pages/taxi/Booking";
import TaxiHistory from "@/pages/taxi/History";
import TaxiLocations from "@/pages/taxi/Locations";
import TaxiSubscription from "@/pages/taxi/Subscription";
import TaxiBusiness from "@/pages/taxi/Business";
import Contact from "@/pages/Contact";

const mainRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Index /> }, // Page d'accueil originale
      { path: "services/colis", element: <ColisServicePage /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "delivery/map", element: <MapPage /> },
      { path: "services", element: <Services /> },
      { path: "restaurants", element: <Restaurants /> },
      { path: "taxi", element: <Taxi /> },
      { path: "taxi/booking", element: <TaxiBooking /> },
      { path: "taxi/history", element: <TaxiHistory /> },
      { path: "taxi/locations", element: <TaxiLocations /> },
      { path: "taxi/subscription", element: <TaxiSubscription /> },
      { path: "taxi/business", element: <TaxiBusiness /> },
      { path: "contact", element: <Contact /> },
      { 
        path: "order", 
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "auth", 
        element: (
          <ProtectedRoute requireAuth={false}>
            <AuthPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "orders", 
        element: (
          <ProtectedRoute>
            <UserOrders />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "payments", 
        element: (
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        ) 
      },
      {
        path: '/location',
        element: (
          <ProtectedRoute>
            <LocationPage />
          </ProtectedRoute>
        )
      }
    ],
  },
];

export default mainRoutes;
