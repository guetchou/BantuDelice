
import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { GuestRoute } from '@/components/GuestRoute';

export const authRoutes: RouteObject[] = [
  {
    path: "auth/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    )
  },
  {
    path: "auth/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    )
  }
];
