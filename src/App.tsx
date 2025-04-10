
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RootLayout from './layouts/RootLayout';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      // Ajoutez d'autres routes ici au besoin
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
