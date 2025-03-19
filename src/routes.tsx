import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cashback from "./pages/Cashback";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Auth from "./pages/Auth";
import Delivery from "./pages/Delivery";
import Driver from "./pages/Driver";
import DriverDetails from "./pages/DriverDetails";
import DriverOrders from "./pages/DriverOrders";
import DriverOrderDetails from "./pages/DriverOrderDetails";
import DriverProfile from "./pages/DriverProfile";
import DriverSettings from "./pages/DriverSettings";
import DriverHelp from "./pages/DriverHelp";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantOrders from "./pages/RestaurantOrders";
import RestaurantOrderDetails from "./pages/RestaurantOrderDetails";
import RestaurantProducts from "./pages/RestaurantProducts";
import RestaurantSettings from "./pages/RestaurantSettings";
import RestaurantHelp from "./pages/RestaurantHelp";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminSettings from "./pages/AdminSettings";
import AdminHelp from "./pages/AdminHelp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Search from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "cashback",
        element: <Cashback />
      },
      {
        path: "products",
        element: <Products />
      },
      {
        path: "products/:id",
        element: <ProductDetails />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "checkout",
        element: <Checkout />
      },
      {
        path: "orders",
        element: <Orders />
      },
      {
        path: "orders/:id",
        element: <OrderDetails />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "help",
        element: <Help />
      },
      {
        path: "restaurants",
        element: <Restaurants />
      },
      {
        path: "restaurants/:id",
        element: <RestaurantDetails />
      },
      {
        path: "delivery",
        element: <Delivery />
      },
      {
        path: "driver",
        element: <Driver />
      },
      {
        path: "driver/:id",
        element: <DriverDetails />
      },
      {
        path: "driver/orders",
        element: <DriverOrders />
      },
      {
        path: "driver/orders/:id",
        element: <DriverOrderDetails />
      },
      {
        path: "driver/profile",
        element: <DriverProfile />
      },
      {
        path: "driver/settings",
        element: <DriverSettings />
      },
      {
        path: "driver/help",
        element: <DriverHelp />
      },
      {
        path: "restaurant",
        element: <RestaurantDashboard />
      },
      {
        path: "restaurant/orders",
        element: <RestaurantOrders />
      },
      {
        path: "restaurant/orders/:id",
        element: <RestaurantOrderDetails />
      },
      {
        path: "restaurant/products",
        element: <RestaurantProducts />
      },
      {
        path: "restaurant/settings",
        element: <RestaurantSettings />
      },
      {
        path: "restaurant/help",
        element: <RestaurantHelp />
      },
      {
        path: "admin",
        element: <Admin />
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard />
      },
      {
        path: "admin/users",
        element: <AdminUsers />
      },
      {
        path: "admin/products",
        element: <AdminProducts />
      },
      {
        path: "admin/orders",
        element: <AdminOrders />
      },
      {
        path: "admin/settings",
        element: <AdminSettings />
      },
      {
        path: "admin/help",
        element: <AdminHelp />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "terms",
        element: <Terms />
      },
      {
        path: "privacy",
        element: <Privacy />
      },
      {
        path: "faq",
        element: <FAQ />
      },
      {
        path: "blog",
        element: <Blog />
      },
      {
        path: "blog/:id",
        element: <BlogPost />
      },
      {
        path: "services",
        element: <Services />
      },
      {
        path: "services/:id",
        element: <ServiceDetails />
      },
       {
        path: "bookings",
        element: <Bookings />
      },
      {
        path: "bookings/:id",
        element: <BookingDetails />
      },
      {
        path: "search",
        element: <Search />
      },
    ]
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
