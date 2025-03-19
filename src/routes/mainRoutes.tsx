
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

const mainRoutes = [
  {
    path: '/',
    element: <Home />,
    authRequired: false,
  },
  {
    path: '/taxis',
    element: <TaxiBookingForm />,
    authRequired: false,
  },
  {
    path: '/covoiturage',
    element: <Covoiturage />,
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
    element: <OrderConfirmation />,
    authRequired: true,
  },
  {
    path: '/orders',
    element: <Orders />,
    authRequired: true,
  },
  {
    path: '/order/:orderId',
    element: <OrderDetails />,
    authRequired: true,
  },
  {
    path: '/order/:orderId/tracking',
    element: <OrderTracking />,
    authRequired: true,
  },
  {
    path: '/referral',
    element: <ReferralProgram />,
    authRequired: true,
  },
  {
    path: '/wallet',
    element: <Wallet />,
    authRequired: true,
  },
];

export default mainRoutes;
