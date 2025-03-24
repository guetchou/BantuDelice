
import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Restaurants from "@/pages/Restaurants";
import RestaurantDetails from "@/pages/RestaurantDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import SearchResults from "@/pages/SearchResults";
import BookingPage from "@/pages/BookingPage";
import ClientsPage from "@/pages/ClientsPage";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/restaurants",
    element: <Restaurants />,
  },
  {
    path: "/restaurants/:restaurantId",
    element: <RestaurantDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/search",
    element: <SearchResults />,
  },
  {
    path: "/booking/:serviceProviderId",
    element: <BookingPage />,
  },
  {
    path: "/clients",
    element: <ClientsPage />
  }
];
