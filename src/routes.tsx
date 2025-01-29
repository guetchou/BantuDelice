import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Restaurants from "@/pages/Restaurants";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <NavigationProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Navbar />
              <main className="flex-1 pl-[60px] sm:pl-64">
                <Index />
              </main>
            </div>
          </SidebarProvider>
        </NavigationProvider>
      ),
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/restaurants",
      element: (
        <ProtectedRoute>
          <NavigationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 pl-[60px] sm:pl-64">
                  <Restaurants />
                </main>
              </div>
            </SidebarProvider>
          </NavigationProvider>
        </ProtectedRoute>
      ),
    },
    {
      path: "/menu/:restaurantId",
      element: (
        <ProtectedRoute>
          <NavigationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 pl-[60px] sm:pl-64">
                  <RestaurantMenu />
                </main>
              </div>
            </SidebarProvider>
          </NavigationProvider>
        </ProtectedRoute>
      ),
    },
    {
      path: "/services",
      element: (
        <ProtectedRoute>
          <NavigationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 pl-[60px] sm:pl-64">
                  <Services />
                </main>
              </div>
            </SidebarProvider>
          </NavigationProvider>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <NavigationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 pl-[60px] sm:pl-64">
                  <Profile />
                </main>
              </div>
            </SidebarProvider>
          </NavigationProvider>
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <NavigationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 pl-[60px] sm:pl-64">
                  <Orders />
                </main>
              </div>
            </SidebarProvider>
          </NavigationProvider>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;