import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Services from "@/pages/Services";
import Orders from "@/pages/Orders";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/restaurants",
    element: <Restaurants />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantMenu />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/orders",
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
]);