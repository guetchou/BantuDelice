
import { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";

export const errorRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFound />,
  },
];
