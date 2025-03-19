
import React from 'react';
import { RouteObject } from "react-router-dom";
import { Home } from '@/pages/Home';
import Covoiturage from '@/pages/Covoiturage';
import OrderConfirmation from '@/pages/OrderConfirmation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { CartProvider } from '@/contexts/CartContext';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import OrderTracking from '@/pages/OrderTracking';
import ReferralProgram from '@/pages/ReferralProgram';
import Wallet from '@/pages/Wallet';
import TaxiBookingForm from '@/components/taxi/TaxiBookingForm';
import TaxiRideStatus from '@/components/taxi/TaxiRideStatus';
import TaxiRideDetails from '@/pages/TaxiRideDetails';

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout><Home /></MainLayout>,
  },
  {
    path: '/taxis',
    element: <MainLayout><TaxiBookingForm /></MainLayout>,
  },
  {
    path: '/taxi/ride/:rideId',
    element: <ProtectedRoute><MainLayout><TaxiRideStatus /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/taxi/details/:rideId',
    element: <ProtectedRoute><MainLayout><TaxiRideDetails /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/covoiturage',
    element: <MainLayout><Covoiturage /></MainLayout>,
  },
  {
    path: '/restaurant/:id',
    element: (
      <CartProvider>
        <MainLayout />
      </CartProvider>
    ),
  },
  {
    path: '/restaurant/:id/menu',
    element: (
      <CartProvider>
        <MainLayout />
      </CartProvider>
    ),
  },
  {
    path: '/restaurant/:id/reservation',
    element: (
      <CartProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </CartProvider>
    ),
  },
  {
    path: '/order-confirmation/:orderId',
    element: <ProtectedRoute><MainLayout><OrderConfirmation /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/orders',
    element: <ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/order/:orderId',
    element: <ProtectedRoute><MainLayout><OrderDetails /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/order/:orderId/tracking',
    element: <ProtectedRoute><MainLayout><OrderTracking /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/referral',
    element: <ProtectedRoute><MainLayout><ReferralProgram /></MainLayout></ProtectedRoute>,
  },
  {
    path: '/wallet',
    element: <ProtectedRoute><MainLayout><Wallet /></MainLayout></ProtectedRoute>,
  },
];

export default mainRoutes;
