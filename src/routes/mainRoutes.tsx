
import React from 'react';
import { RouteObject } from 'react-router-dom';
import RestaurantLayout from '@/layouts/RestaurantLayout';
import Home from '@/pages/Home';
import RestaurantMenu from '@/pages/RestaurantMenu';
import RestaurantDetails from '@/pages/RestaurantDetails';
import RestaurantReservation from '@/pages/RestaurantReservation';
import OrderTracking from '@/pages/OrderTracking';
import OrderDetails from '@/pages/OrderDetails';
import Orders from '@/pages/Orders';
import Profile from '@/pages/Profile';
import Wallet from '@/pages/Wallet';
import Favorites from '@/pages/Favorites';
import Notifications from '@/pages/Notifications';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Booking from '@/pages/taxi/Booking';
import TaxiRide from '@/pages/TaxiRide';
import WalletOverview from '@/pages/Wallet/WalletOverview';

// Lazy load some routes to reduce initial bundle size
const RideStatus = React.lazy(() => import('@/pages/taxi/RideStatus'));

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: '/restaurant/:id',
    element: <RestaurantLayout />,
    children: [
      {
        path: '',
        element: <RestaurantDetails />,
      },
      {
        path: 'menu',
        element: <RestaurantMenu />,
      },
      {
        path: 'reservation',
        element: <RestaurantReservation />,
      },
    ],
  },
  {
    path: '/order-tracking/:id',
    element: <OrderTracking />,
  },
  {
    path: '/order/:id',
    element: <OrderDetails />,
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/wallet',
    element: <Wallet />,
    children: [
      {
        path: '',
        element: <WalletOverview />,
      },
    ],
  },
  {
    path: '/favorites',
    element: <Favorites />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/order-confirmation/:id',
    element: <OrderConfirmation />,
  },
  {
    path: '/taxi/booking',
    element: <Booking />,
  },
  {
    path: '/taxi/ride/:rideId',
    element: <TaxiRide />,
  },
  {
    path: '/taxi/ride-status/:rideId',
    element: (
      <React.Suspense fallback={<div>Chargement...</div>}>
        <RideStatus />
      </React.Suspense>
    ),
  },
];

export default mainRoutes;
