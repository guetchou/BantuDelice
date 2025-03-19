
import React from 'react';
import { Home } from '@/pages/Home';
import { RestaurantLayout } from '@/layouts/RestaurantLayout';
import Covoiturage from '@/pages/Covoiturage';
import { RestaurantDetails } from '@/pages/RestaurantDetails';
import { RestaurantReservation } from '@/pages/RestaurantReservation';
import { CartProvider } from '@/contexts/CartContext';
import { RestaurantMenu } from '@/pages/RestaurantMenu';
import OrderConfirmation from '@/pages/OrderConfirmation';
import { Orders } from '@/pages/Orders';
import { OrderDetails } from '@/pages/OrderDetails';
import { OrderTracking } from '@/pages/OrderTracking';
import { ReferralProgram } from '@/pages/ReferralProgram';
import { Wallet } from '@/pages/Wallet';
import { TaxiBookingForm } from '@/pages/TaxiBookingForm';
import TaxiRideStatus from '@/components/taxi/TaxiRideStatus';
import TaxiRideDetails from '@/pages/TaxiRideDetails';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';

const mainRoutes = [
  {
    path: '/',
    element: <MainLayout><Home /></MainLayout>,
    authRequired: false,
  },
  {
    path: '/taxis',
    element: <MainLayout><TaxiBookingForm /></MainLayout>,
    authRequired: false,
  },
  {
    path: '/taxi/ride/:rideId',
    element: <MainLayout><TaxiRideStatus /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/taxi/details/:rideId',
    element: <MainLayout><TaxiRideDetails /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/covoiturage',
    element: <MainLayout><Covoiturage /></MainLayout>,
    authRequired: false,
  },
  {
    path: '/restaurant/:id',
    element: (
      <CartProvider>
        <RestaurantLayout>
          <RestaurantDetails />
        </RestaurantLayout>
      </CartProvider>
    ),
    authRequired: false,
  },
  {
    path: '/restaurant/:id/menu',
    element: (
      <CartProvider>
        <RestaurantLayout>
          <RestaurantMenu />
        </RestaurantLayout>
      </CartProvider>
    ),
    authRequired: false,
  },
  {
    path: '/restaurant/:id/reservation',
    element: (
      <CartProvider>
        <RestaurantLayout>
          <RestaurantReservation />
        </RestaurantLayout>
      </CartProvider>
    ),
    authRequired: true,
  },
  {
    path: '/order-confirmation/:orderId',
    element: <MainLayout><OrderConfirmation /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/orders',
    element: <MainLayout><Orders /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/order/:orderId',
    element: <MainLayout><OrderDetails /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/order/:orderId/tracking',
    element: <MainLayout><OrderTracking /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/referral',
    element: <MainLayout><ReferralProgram /></MainLayout>,
    authRequired: true,
  },
  {
    path: '/wallet',
    element: <MainLayout><Wallet /></MainLayout>,
    authRequired: true,
  },
];

export default mainRoutes;
