
import React from 'react';
import { Route } from 'react-router-dom';
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

const mainRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    
    {/* Restaurant Routes */}
    <Route path="restaurants" element={<Restaurants />} />
    <Route path="restaurants/:id" element={<RestaurantDetails />} />
    
    {/* Taxi Routes */}
    <Route path="taxi/booking" element={<TaxiBooking />} />
    <Route path="taxi/ride/:id" element={<TaxiRideStatus />} />
    
    {/* Covoiturage Routes */}
    <Route path="covoiturage" element={<Covoiturage />} />
    
    {/* Order Routes */}
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetails />} />
    
    {/* User Routes */}
    <Route path="profile" element={<Profile />} />
    <Route path="favorites" element={<Favorites />} />
    <Route path="messages" element={<Messages />} />
    <Route path="notifications" element={<Notifications />} />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Route>
);

export default mainRoutes;
