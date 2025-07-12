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

const mainRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Index /> }, // Page d'accueil originale
      { path: "services/colis", element: <ColisServicePage /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "delivery/map", element: <MapPage /> },
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
