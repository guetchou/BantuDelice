import { createBrowserRouter } from "react-router-dom";
import ScanUpdatePage from "@/pages/tracking/ScanUpdatePage";
import OperatorPortalPage from "@/pages/tracking/OperatorPortalPage";

export const router = createBrowserRouter([
  {
    path: "/tracking/scan",
    element: <ScanUpdatePage />,
  },
  {
    path: "/operator/portal",
    element: <OperatorPortalPage />,
  },
]);
