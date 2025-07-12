
import { RouteObject } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Users from "@/pages/admin/Users";
import Admin from "@/pages/Admin";
import FeatureFlags from "@/pages/admin/FeatureFlags";
import UserCredentials from "@/pages/admin/UserCredentials";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Admin />
      },
      {
        path: "login",
        element: <AdminLogin />
      },
      {
        path: "dashboard",
        element: <AdminDashboard />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "user-credentials",
        element: <UserCredentials />
      },
      {
        path: "feature-flags",
        element: <FeatureFlags />
      }
      // Routes administratives à venir
      /*
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "restaurants",
        element: <AdminRestaurants />
      },
      {
        path: "settings",
        element: <AdminSettings />
      },
      {
        path: "profile",
        element: <AdminProfile />
      }
      */
    ]
  }
];
