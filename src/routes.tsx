import { createBrowserRouter } from "react-router-dom";
import App from "./App";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
