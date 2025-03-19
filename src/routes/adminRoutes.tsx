
import { RouteObject } from "react-router-dom";
import Admin from "@/pages/Admin";
import ProtectedRoute from "@/components/ProtectedRoute";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <Admin />
      </ProtectedRoute>
    )
  },
  // Commented routes preserved for future implementation
  /*
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "/admin/users",
    element: <AdminUsers />
  },
  {
    path: "/admin/products",
    element: <AdminProducts />
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />
  },
  {
    path: "/admin/help",
    element: <AdminHelp />
  },
  */
];
