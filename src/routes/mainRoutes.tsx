
import React from 'react';
import { RouteObject } from "react-router-dom";
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CartProvider } from '@/contexts/CartContext';

// Pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import OrderTracking from '@/pages/OrderTracking';
import ReferralProgram from '@/pages/ReferralProgram';
import Wallet from '@/pages/Wallet';
import Covoiturage from '@/pages/Covoiturage';
import Restaurants from '@/pages/Restaurants';
import RestaurantDetails from '@/pages/RestaurantDetails';

// Taxi pages
import TaxiBookingForm from '@/components/taxi/TaxiBookingForm';
import TaxiRideStatus from '@/components/taxi/TaxiRideStatus';
import TaxiRideDetails from '@/pages/TaxiRideDetails';

// Restaurant management pages
import RestaurantManagementPage from '@/pages/restaurant/ManagementPage';
import RestaurantDashboard from '@/pages/restaurant/Dashboard';

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      // Restaurants
      {
        path: '/restaurants',
        element: <Restaurants />
      },
      {
        path: '/restaurant/:id',
        element: <CartProvider><RestaurantDetails /></CartProvider>
      },
      // Restaurant management
      {
        path: '/restaurant/management/:id',
        element: <ProtectedRoute><RestaurantManagementPage /></ProtectedRoute>
      },
      {
        path: '/restaurant/dashboard',
        element: <ProtectedRoute><RestaurantDashboard /></ProtectedRoute>
      },
      // Taxis
      {
        path: '/taxis',
        element: <TaxiBookingForm />
      },
      {
        path: '/taxi/ride/:rideId',
        element: <ProtectedRoute><TaxiRideStatus /></ProtectedRoute>
      },
      {
        path: '/taxi/details/:rideId',
        element: <ProtectedRoute><TaxiRideDetails /></ProtectedRoute>
      },
      // Covoiturage
      {
        path: '/covoiturage',
        element: <Covoiturage />
      },
      // Orders
      {
        path: '/order-confirmation/:orderId',
        element: <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
      },
      {
        path: '/orders',
        element: <ProtectedRoute><Orders /></ProtectedRoute>
      },
      {
        path: '/order/:orderId',
        element: <ProtectedRoute><OrderDetails /></ProtectedRoute>
      },
      {
        path: '/order/:orderId/tracking',
        element: <ProtectedRoute><OrderTracking /></ProtectedRoute>
      },
      // User features
      {
        path: '/referral',
        element: <ProtectedRoute><ReferralProgram /></ProtectedRoute>
      },
      {
        path: '/wallet',
        element: <ProtectedRoute><Wallet /></ProtectedRoute>
      }
    ]
  }
];

export default mainRoutes;
