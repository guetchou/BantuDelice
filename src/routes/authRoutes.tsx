
import { RouteObject } from "react-router-dom";
import Auth from "@/pages/Auth";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { GuestRoute } from "@/components/GuestRoute";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth/login",
    element: <GuestRoute><Login /></GuestRoute>,
  },
  {
    path: "/auth/register",
    element: <GuestRoute><Register /></GuestRoute>,
  }
];
