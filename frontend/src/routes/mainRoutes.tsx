import React, { Suspense, lazy } from "react";
import NotFound from "@/pages/NotFound";
import App from "@/App";
import ErrorBoundary from '@/components/ErrorBoundary';
import { colisRoutes } from './colisRoutes';

const SimpleIndex = lazy(() => import("@/pages/SimpleIndex"));
const Services = lazy(() => import("@/pages/Services"));
const Taxi = lazy(() => import("@/pages/Taxi"));
const Delivery = lazy(() => import("@/pages/Delivery"));
const Contact = lazy(() => import("@/pages/Contact"));
const Index = lazy(() => import("@/pages/Index"));
const Colis = lazy(() => import("@/pages/colis/ColisLandingPage"));
const LocationVoiture = lazy(() => import("@/pages/LocationVoiture"));
const Restaurant = lazy(() => import("@/pages/Restaurant"));
const RestaurantDetail = lazy(() => import("@/pages/RestaurantDetail"));
const Hotel = lazy(() => import("@/pages/Hotel"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Auth = lazy(() => import("@/pages/Auth"));
const CustomerRegister = lazy(() => import("@/pages/register/CustomerRegister"));
const DriverRegister = lazy(() => import("@/pages/register/DriverRegister"));
const DeliveryRegister = lazy(() => import("@/pages/register/DeliveryRegister"));
const RestaurantRegister = lazy(() => import("@/pages/register/RestaurantRegister"));
const HotelRegister = lazy(() => import("@/pages/register/HotelRegister"));
const ShopRegister = lazy(() => import("@/pages/register/ShopRegister"));
const ServiceProviderRegister = lazy(() => import("@/pages/register/ServiceProviderRegister"));
const BusinessRegister = lazy(() => import("@/pages/register/BusinessRegister"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderTracking = lazy(() => import("@/pages/OrderTracking"));
const Profile = lazy(() => import("@/pages/Profile"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const About = lazy(() => import("@/pages/About"));
const Covoiturage = lazy(() => import("@/pages/Covoiturage"));
const CGU = lazy(() => import("@/pages/CGU"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Help = lazy(() => import("@/pages/Help"));
const CallCenter = lazy(() => import("@/pages/CallCenter"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Terms = lazy(() => import("@/pages/Terms"));
const Order = lazy(() => import("@/pages/Order"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const Shopping = lazy(() => import("@/pages/Shopping"));
const Entertainment = lazy(() => import("@/pages/Entertainment"));
const Health = lazy(() => import("@/pages/Health"));
const Education = lazy(() => import("@/pages/Education"));
const Finance = lazy(() => import("@/pages/Finance"));
const RealEstate = lazy(() => import("@/pages/RealEstate"));
const ProfessionalServices = lazy(() => import("@/pages/ProfessionalServices"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const RestaurantDashboard = lazy(() => import("@/pages/restaurant/Dashboard"));
const RestaurantIntelligence = lazy(() => import("@/pages/restaurant/Intelligence"));
const DriverDashboard = lazy(() => import("@/pages/driver/DriverDashboard"));
const UserDashboard = lazy(() => import("@/pages/user/UserDashboard"));

const suspense = (element) => <Suspense fallback={<div className="text-center py-20 text-xl text-white">Chargement...</div>}>{element}</Suspense>;

const mainRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: suspense(<Index />) },
      { path: "simple", element: suspense(<SimpleIndex />) },
      { path: "services", element: suspense(<Services />) },
      { path: "taxi", element: suspense(<Taxi />) },
      { path: "delivery", element: suspense(<Delivery />) },
      { path: "contact", element: suspense(<Contact />) },
      { path: "colis", element: suspense(<Colis />) },
      { path: "location-voiture", element: suspense(<LocationVoiture />) },
      { path: "restaurant", element: suspense(<Restaurant />) },
      { path: "restaurants", element: suspense(<Restaurant />) },
      { path: "restaurants/:id", element: suspense(<RestaurantDetail />) },
      { path: "hotel", element: suspense(<Hotel />) },
      { path: "cart", element: suspense(<Cart />) },
      { path: "checkout", element: suspense(<Checkout />) },
      { path: "profile", element: suspense(<Profile />) },
      { path: "gallery", element: suspense(<Gallery />) },
      { path: "about", element: suspense(<About />) },
      { path: "covoiturage", element: suspense(<Covoiturage />) },
      { path: "cgu", element: suspense(<CGU />) },
      { path: "privacy", element: suspense(<Privacy />) },
      { path: "help", element: suspense(<Help />) },
      { path: "order", element: suspense(<Order />) },
      { path: "dashboard", element: suspense(<Dashboard />) },
      { path: "settings", element: suspense(<Settings />) },
      { path: "faq", element: suspense(<FAQ />) },
      { path: "terms", element: suspense(<Terms />) },
      { path: "shopping", element: suspense(<Shopping />) },
      { path: "entertainment", element: suspense(<Entertainment />) },
      { path: "health", element: suspense(<Health />) },
      { path: "education", element: suspense(<Education />) },
      { path: "finance", element: suspense(<Finance />) },
      { path: "real-estate", element: suspense(<RealEstate />) },
      { path: "professional-services", element: suspense(<ProfessionalServices />) },
      { path: "call-center", element: suspense(<CallCenter />) },
      // Routes d'administration
      { path: "admin", element: suspense(<AdminDashboard />) },
      { path: "admin/users", element: suspense(<AdminUsers />) },
      { path: "admin/login", element: suspense(<AdminLogin />) },
      // Routes restaurant
      { path: "restaurant/dashboard", element: suspense(<RestaurantDashboard />) },
      { path: "restaurant/intelligence", element: suspense(<RestaurantIntelligence />) },
      // Routes taxi
      { path: "driver/dashboard", element: suspense(<DriverDashboard />) },
      { path: "user/dashboard", element: suspense(<UserDashboard />) },
      // Routes d'authentification (unifiées)
      { path: "login", element: suspense(<Login />) },
      { path: "register", element: suspense(<Register />) },
      { path: "auth", element: suspense(<Auth />) },
      { path: "auth/login", element: suspense(<Auth />) },
      { path: "auth/register", element: suspense(<Auth />) },
      { path: "register/customer", element: suspense(<CustomerRegister />) },
      { path: "register/driver", element: suspense(<DriverRegister />) },
      { path: "register/delivery", element: suspense(<DeliveryRegister />) },
      { path: "register/restaurant", element: suspense(<RestaurantRegister />) },
      { path: "register/hotel", element: suspense(<HotelRegister />) },
      { path: "register/shop", element: suspense(<ShopRegister />) },
      { path: "register/service-provider", element: suspense(<ServiceProviderRegister />) },
      { path: "register/business", element: suspense(<BusinessRegister />) },
      // Intégration des routes Colis
      ...colisRoutes,
      { path: "*", element: <NotFound /> }
    ]
  }
];

export default mainRoutes;
