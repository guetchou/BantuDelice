import React from 'react';
import { RouteObject } from 'react-router-dom';
import App from '@/App';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import Home from '@/pages/Home';
import Index from '@/pages/Index';

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

import TaxiHistoryPage from "@/pages/taxi/History";
import TaxiLocationsPage from "@/pages/taxi/Locations";
import TaxiSubscriptionPage from "@/pages/taxi/Subscription";
import TaxiSubscriptionDetails from "@/pages/taxi/SubscriptionDetails";
import TaxiBusinessPage from "@/pages/taxi/Business";
import TaxiVehicleComparison from "@/pages/taxi/VehicleComparison";
import Taxi from "@/pages/Taxi";

import DeliveryDashboard from '@/pages/delivery/Dashboard';
import DeliveryPage from '@/pages/delivery/index';

import ClientsPage from '@/pages/ClientsPage';

import { authRoutes } from './authRoutes';
import { errorRoutes } from './errorRoutes';

import ProtectedRoute from '@/components/ProtectedRoute';

import Services from '@/pages/Services';
import About from '@/pages/About';
import Search from '@/pages/Search';

import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import OrderSuccess from '@/pages/OrderSuccess';
import Wallet from '@/pages/Wallet';

import CovoiturageDetails from '@/pages/covoiturage/Details';
import CovoiturageBooking from '@/pages/covoiturage/Booking';
import CovoiturageMyRides from '@/pages/covoiturage/MyRides';

const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Index /> },
          { path: "home", element: <Home /> },
          
          { path: "restaurants", element: <Restaurants /> },
          { path: "restaurants/:id", element: <RestaurantDetails /> },
          { path: "search", element: <Search /> },
          
          { path: "checkout", element: <ProtectedRoute><Checkout /></ProtectedRoute> },
          { path: "orders", element: <ProtectedRoute><Orders /></ProtectedRoute> },
          { path: "orders/:id", element: <ProtectedRoute><OrderDetails /></ProtectedRoute> },
          { path: "order-tracking/:id", element: <OrderTracking /> },
          { path: "order-success/:id", element: <OrderSuccess /> },
          
          { path: "delivery", element: <DeliveryDashboard /> },
          { path: "delivery/dashboard", element: <DeliveryPage /> },
          
          { path: "taxi", element: <Taxi /> },
          { path: "taxi/booking", element: <TaxiBooking /> },
          { path: "taxi/ride/:id", element: <TaxiRideStatus /> },
          { path: "taxi/history", element: <TaxiHistoryPage /> },
          { path: "taxi/locations", element: <TaxiLocationsPage /> },
          { path: "taxi/subscription", element: <TaxiSubscriptionPage /> },
          { path: "taxi/subscription/:planId", element: <TaxiSubscriptionDetails /> },
          { path: "taxi/business", element: <TaxiBusinessPage /> },
          { path: "taxi/compare-vehicles", element: <TaxiVehicleComparison /> },
          
          { path: "covoiturage", element: <Covoiturage /> },
          { path: "covoiturage/details/:id", element: <CovoiturageDetails /> },
          { path: "covoiturage/booking/:id", element: <ProtectedRoute><CovoiturageBooking /></ProtectedRoute> },
          { path: "covoiturage/mes-trajets", element: <ProtectedRoute><CovoiturageMyRides /></ProtectedRoute> },
          
          { path: "profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
          { path: "favorites", element: <ProtectedRoute><Favorites /></ProtectedRoute> },
          { path: "messages", element: <ProtectedRoute><Messages /></ProtectedRoute> },
          { path: "notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
          { path: "wallet", element: <ProtectedRoute><Wallet /></ProtectedRoute> },
          
          { path: "services", element: <Services /> },
          { path: "about", element: <About /> },
          
          { path: "clients", element: <ProtectedRoute><ClientsPage /></ProtectedRoute> },
        ]
      }
    ]
  },
  ...authRoutes,
  ...errorRoutes
];

export default mainRoutes;
