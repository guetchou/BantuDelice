import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Services from "@/pages/Services";
import Orders from "@/pages/Orders";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <NavigationProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Navbar />
          <main className="flex-1 pl-[60px] sm:pl-64">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NavigationProvider>
        <Index />
      </NavigationProvider>
    )
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/profile",
    element: <ProtectedLayout><Profile /></ProtectedLayout>
  },
  {
    path: "/restaurants",
    element: <ProtectedLayout><Restaurants /></ProtectedLayout>
  },
  {
    path: "/restaurant/:id",
    element: <ProtectedLayout><RestaurantMenu /></ProtectedLayout>
  },
  {
    path: "/services",
    element: <ProtectedLayout><Services /></ProtectedLayout>
  },
  {
    path: "/orders",
    element: <ProtectedLayout><Orders /></ProtectedLayout>
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;