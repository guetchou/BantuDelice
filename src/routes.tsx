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
    ],
  },
]);