
import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { mainRoutes } from "./mainRoutes";
import { errorRoutes } from "./errorRoutes";

// Combine all route groups into a single router
export const router = createBrowserRouter([
  ...mainRoutes,
  ...authRoutes,
  ...adminRoutes,
  ...errorRoutes,
]);
