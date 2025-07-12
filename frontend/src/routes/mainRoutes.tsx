import SimpleIndex from "@/pages/SimpleIndex";
import ColisServicePage from "@/pages/ColisServicePage";
import DeliveryPage from "@/pages/delivery";
import MapPage from "@/pages/delivery/MapPage";
import OrderPage from "@/pages/OrderPage";
import TestPage from "@/pages/TestPage";
import App from "@/App";

const mainRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <SimpleIndex /> },
      { path: "services/colis", element: <ColisServicePage /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "delivery/map", element: <MapPage /> },
      { path: "order", element: <OrderPage /> },
      { path: "test", element: <TestPage /> },
    ],
  },
];

export default mainRoutes;
