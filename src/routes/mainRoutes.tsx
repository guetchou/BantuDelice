
import React from 'react';
import { RouteObject } from 'react-router-dom';
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
import Favorites from '@/pages/Favorites';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import NotFound from '@/pages/NotFound';
import DeliveryDashboard from '@/pages/delivery/Dashboard';
import DeliveryPage from '@/pages/delivery/index';
import { authRoutes } from './authRoutes';
import { errorRoutes } from './errorRoutes';
import TaxiHistoryPage from "@/pages/taxi/History";
import TaxiLocationsPage from "@/pages/taxi/Locations";
import TaxiSubscriptionPage from "@/pages/taxi/Subscription";
import TaxiSubscriptionDetails from "@/pages/taxi/SubscriptionDetails";
import TaxiBusinessPage from "@/pages/taxi/Business";

const mainRoutes: RouteObject[] = [
  ...authRoutes,
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
      { path: "taxi/booking", element: <TaxiBooking /> },
      { path: "taxi/ride/:id", element: <TaxiRideStatus /> },
      
      // Covoiturage Routes
      { path: "covoiturage", element: <Covoiturage /> },
      
      // Order Routes
      { path: "orders", element: <Orders /> },
      { path: "orders/:id", element: <OrderDetails /> },
      
      // User Routes
      { path: "profile", element: <Profile /> },
      { path: "favorites", element: <Favorites /> },
      { path: "messages", element: <Messages /> },
      { path: "notifications", element: <Notifications /> },
    ]
  },
  {
    path: "/taxi/history",
    element: <TaxiHistoryPage />
  },
  {
    path: "/taxi/locations",
    element: <TaxiLocationsPage />
  },
  {
    path: "/taxi/subscription",
    element: <TaxiSubscriptionPage />
  },
  {
    path: "/taxi/subscription/:planId",
    element: <TaxiSubscriptionDetails />
  },
  {
    path: "/taxi/business",
    element: <TaxiBusinessPage />
  },
  ...errorRoutes
];

export default mainRoutes;
