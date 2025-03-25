
import React from 'react';
import { RouteObject } from 'react-router-dom';
import App from '@/App';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import Restaurants from '@/pages/Restaurants';
import RestaurantDetails from '@/pages/restaurants/RestaurantDetails';
import TaxiBooking from '@/pages/taxi/Booking';
import TaxiRideStatus from '@/pages/taxi/RideStatus';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import Covoiturage from '@/pages/Covoiturage';
import Profile from '@/pages/Profile';
import ProfilePage from '@/pages/auth/ProfilePage';
import Favorites from '@/pages/Favorites';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import NotFound from '@/pages/NotFound';
import DeliveryDashboard from '@/pages/delivery/Dashboard';
import DeliveryPage from '@/pages/delivery/index';
import ClientsPage from '@/pages/ClientsPage';
import { authRoutes } from './authRoutes';
import { errorRoutes } from './errorRoutes';
import TaxiHistoryPage from "@/pages/taxi/History";
import TaxiLocationsPage from "@/pages/taxi/Locations";
import TaxiSubscriptionPage from "@/pages/taxi/Subscription";
import TaxiSubscriptionDetails from "@/pages/taxi/SubscriptionDetails";
import TaxiBusinessPage from "@/pages/taxi/Business";
import TaxiVehicleComparison from "@/pages/taxi/VehicleComparison";
import Taxi from "@/pages/Taxi";
import ProtectedRoute from '@/components/ProtectedRoute';

const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          
          // Restaurant Routes
          { path: "restaurants", element: <Restaurants /> },
          { path: "restaurants/:id", element: <RestaurantDetails /> },
          
          // Delivery Routes
          { path: "delivery", element: <DeliveryDashboard /> },
          { path: "delivery/dashboard", element: <DeliveryPage /> },
          
          // Taxi Routes
          { path: "taxi", element: <Taxi /> },
          { path: "taxi/booking", element: <TaxiBooking /> },
          { path: "taxi/ride/:id", element: <TaxiRideStatus /> },
          { path: "taxi/history", element: <TaxiHistoryPage /> },
          { path: "taxi/locations", element: <TaxiLocationsPage /> },
          { path: "taxi/subscription", element: <TaxiSubscriptionPage /> },
          { path: "taxi/subscription/:planId", element: <TaxiSubscriptionDetails /> },
          { path: "taxi/business", element: <TaxiBusinessPage /> },
          { path: "taxi/compare-vehicles", element: <TaxiVehicleComparison /> },
          
          // Covoiturage Routes
          { path: "covoiturage", element: <Covoiturage /> },
          
          // Order Routes
          { path: "orders", element: <Orders /> },
          { path: "orders/:id", element: <OrderDetails /> },
          
          // User Routes
          { 
            path: "profile", 
            element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
          },
          { path: "favorites", element: <Favorites /> },
          { path: "messages", element: <Messages /> },
          { path: "notifications", element: <Notifications /> },
          
          // Client Management Route
          { 
            path: "clients", 
            element: <ProtectedRoute><ClientsPage /></ProtectedRoute>
          },
        ]
      }
    ]
  },
  ...authRoutes,
  ...errorRoutes
];

export default mainRoutes;
