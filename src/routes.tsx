
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantMenu from './pages/RestaurantMenu';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderTracking from './pages/OrderTracking';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import Loyalty from './pages/Loyalty';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';

// Routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'restaurants',
        element: <Restaurants />,
      },
      {
        path: 'restaurants/:id',
        element: <RestaurantMenu />,
      },
      {
        path: 'orders',
        element: <ProtectedRoute><Orders /></ProtectedRoute>,
      },
      {
        path: 'orders/:id',
        element: <ProtectedRoute><OrderDetails /></ProtectedRoute>,
      },
      {
        path: 'orders/:id/tracking',
        element: <ProtectedRoute><OrderTracking /></ProtectedRoute>,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: 'settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: 'favorites',
        element: <ProtectedRoute><Favorites /></ProtectedRoute>,
      },
      {
        path: 'loyalty',
        element: <ProtectedRoute><Loyalty /></ProtectedRoute>,
      },
      {
        path: 'loyalty/rewards',
        element: <ProtectedRoute><Rewards /></ProtectedRoute>,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: 'wallet',
        element: <ProtectedRoute><Wallet /></ProtectedRoute>,
      },
    ],
  },
]);

// Router component to be used in the application
export default function Routes() {
  return <RouterProvider router={router} />;
}

import Rewards from './pages/loyalty/Rewards';
