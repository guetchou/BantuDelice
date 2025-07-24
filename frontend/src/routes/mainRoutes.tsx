import SimpleIndex from "@/pages/SimpleIndex";
import ColisServicePage from "@/pages/ColisServicePage";
import DeliveryPage from "@/pages/delivery";
import MapPage from "@/pages/delivery/MapPage";
import OrderPage from "@/pages/OrderPage";
import TestPage from "@/pages/TestPage";
import App from "@/App";
import ColisLandingPage from "@/pages/colis/ColisLandingPage";
import ColisInternationalPage from "@/pages/colis/ColisInternationalPage";
import ColisNationalPage from "@/pages/colis/ColisNationalPage";
import ColisTarifsPage from "@/pages/colis/ColisTarifsPage";
import AProposColisPage from "@/pages/colis/AProposColisPage";
import ColisApiPage from "@/pages/colis/ColisApiPage";
import ColisDashboardPage from "@/pages/colis/ColisDashboardPage";
import ColisExpedierPage from "@/pages/colis/ColisExpedierPage";
import ColisHistoriquePage from "@/pages/colis/ColisHistoriquePage";
import TaxiBooking from "@/pages/taxi/Booking";
import TaxiBusiness from "@/pages/taxi/Business";
import TaxiHistory from "@/pages/taxi/History";
import TaxiLocations from "@/pages/taxi/Locations";
import TaxiRideStatus from "@/pages/taxi/RideStatus";
import TaxiSubscription from "@/pages/taxi/Subscription";
import TaxiSubscriptionDetails from "@/pages/taxi/SubscriptionDetails";
import TaxiVehicleComparison from "@/pages/taxi/VehicleComparison";
import LocationVoiture from "@/pages/location-voiture/LocationVoiture";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Plomberie from "@/pages/services/Plomberie";
import Electricite from "@/pages/services/Electricite";
import Menage from "@/pages/services/Menage";
import Comptabilite from "@/pages/services/Comptabilite";
import Juridique from "@/pages/services/Juridique";
import Transport from "@/pages/services/Transport";
import Coiffure from "@/pages/services/Coiffure";
import ChefDomicile from "@/pages/services/ChefDomicile";
import Decoration from "@/pages/services/Decoration";
import Urgent from "@/pages/services/Urgent";
import Logistique from "@/pages/services/Logistique";
import NotFound from "@/pages/NotFound";

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
      { path: "services", element: <Services /> },
      { path: "services/contact", element: <Contact /> },
      { path: "services/plomberie", element: <Plomberie /> },
      { path: "services/electricite", element: <Electricite /> },
      { path: "services/menage", element: <Menage /> },
      { path: "services/comptabilite", element: <Comptabilite /> },
      { path: "services/juridique", element: <Juridique /> },
      { path: "services/transport", element: <Transport /> },
      { path: "services/coiffure", element: <Coiffure /> },
      { path: "services/chef-domicile", element: <ChefDomicile /> },
      { path: "services/decoration", element: <Decoration /> },
      { path: "services/urgent", element: <Urgent /> },
      { path: "services/logistique", element: <Logistique /> },
      { path: "colis", element: <ColisLandingPage />,
        children: [
          { path: "international", element: <ColisInternationalPage /> },
          { path: "national", element: <ColisNationalPage /> },
          { path: "tarifs", element: <ColisTarifsPage /> },
          { path: "a-propos", element: <AProposColisPage /> },
          { path: "api", element: <ColisApiPage /> },
          { path: "dashboard", element: <ColisDashboardPage /> },
          { path: "expedier", element: <ColisExpedierPage /> },
          { path: "historique", element: <ColisHistoriquePage /> },
        ]
      },
      { path: "taxi", element: <TaxiBooking />, // page d'accueil taxi par défaut
        children: [
          { path: "booking", element: <TaxiBooking /> },
          { path: "business", element: <TaxiBusiness /> },
          { path: "history", element: <TaxiHistory /> },
          { path: "locations", element: <TaxiLocations /> },
          { path: "ride-status", element: <TaxiRideStatus /> },
          { path: "subscription", element: <TaxiSubscription /> },
          { path: "subscription-details", element: <TaxiSubscriptionDetails /> },
          { path: "vehicle-comparison", element: <TaxiVehicleComparison /> },
        ]
      },
      { path: "location-voiture", element: <LocationVoiture /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default mainRoutes;
