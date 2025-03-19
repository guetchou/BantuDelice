import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Cashback from "@/pages/Cashback";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Restaurants from "@/pages/Restaurants";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import Favorites from "@/pages/Favorites";
import Loyalty from "@/pages/Loyalty";
import Notifications from "@/pages/Notifications";
import Legal from "@/pages/Legal";
import Index from "@/pages/Index";
import FeatureFlags from "@/pages/FeatureFlags";
import ProtectedRoute from "@/components/ProtectedRoute";
import WalletOverview from "@/pages/Wallet/WalletOverview";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "index",
        element: <Index />
      },
      {
        path: "cashback",
        element: <Cashback />
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        )
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
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
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "services",
        element: <Services />
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        )
      },
      {
        path: "loyalty",
        element: (
          <ProtectedRoute>
            <Loyalty />
          </ProtectedRoute>
        )
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        )
      },
      {
        path: "legal",
        element: <Legal />
      },
      {
        path: "feature-flags",
        element: (
          <ProtectedRoute adminOnly>
            <FeatureFlags />
          </ProtectedRoute>
        )
      },
      {
        path: "wallet",
        element: (
          <ProtectedRoute>
            <WalletOverview />
          </ProtectedRoute>
        )
      },
      // Commented routes preserved for future implementation
      /*
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
      */
    ]
  },
];
