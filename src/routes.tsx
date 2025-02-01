import { createBrowserRouter, Outlet } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Orders from "@/pages/Orders";
import Services from "@/pages/Services";
import TaxiBookingPage from "@/pages/taxi/Booking";
import RideStatusPage from "@/pages/taxi/RideStatus";
import ProtectedRoute from "@/components/ProtectedRoute";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { Toaster } from "@/components/ui/toaster";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Wallet from "@/pages/Wallet";
import Favorites from "@/pages/Favorites";
import Help from "@/pages/Help";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";

const RootLayout = () => {
  return (
    <NavigationProvider>
      <Outlet />
      <Toaster />
    </NavigationProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Index />,
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
        path: "services",
        element: <Services />,
      },
      {
        path: "taxi/booking",
        element: (
          <ProtectedRoute>
            <TaxiBookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "taxi/ride/:rideId",
        element: (
          <ProtectedRoute>
            <RideStatusPage />
          </ProtectedRoute>
        ),
      },
      // Nouvelles routes
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
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
        path: "wallet",
        element: (
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        ),
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
        path: "help",
        element: <Help />,
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
        path: "legal",
        element: <Legal />,
      },
    ],
  },
]);