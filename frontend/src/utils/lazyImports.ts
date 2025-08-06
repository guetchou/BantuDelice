import React, { lazy } from 'react';

// ===== PAGES PRINCIPALES (chargées fréquemment) =====
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyHome = lazy(() => import('@/pages/Home'));
export const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
export const LazyLogin = lazy(() => import('@/pages/Login'));
export const LazyRegister = lazy(() => import('@/pages/Register'));
export const LazyRestaurants = lazy(() => import('@/pages/Restaurants'));
export const LazyRestaurantDetails = lazy(() => import('@/pages/RestaurantDetails'));
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazySettings = lazy(() => import('@/pages/Settings'));

// ===== PAGES DE SERVICES (chargées moins fréquemment) =====
export const LazyCoiffure = lazy(() => import('@/pages/services/Coiffure'));
export const LazyPlomberie = lazy(() => import('@/pages/services/Plomberie'));
export const LazyTransport = lazy(() => import('@/pages/services/Transport'));
export const LazyJuridique = lazy(() => import('@/pages/services/Juridique'));
export const LazyDecoration = lazy(() => import('@/pages/services/Decoration'));
export const LazyUrgent = lazy(() => import('@/pages/services/Urgent'));
export const LazyComptabilite = lazy(() => import('@/pages/services/Comptabilite'));
export const LazyMenage = lazy(() => import('@/pages/services/Menage'));
export const LazyElectricite = lazy(() => import('@/pages/services/Electricite'));
export const LazyLogistique = lazy(() => import('@/pages/services/Logistique'));
export const LazyChefDomicile = lazy(() => import('@/pages/services/ChefDomicile'));

// ===== PAGES DE COLIS (module spécialisé) =====
export const LazyColisDashboard = lazy(() => import('@/pages/colis/ColisDashboardPage'));
export const LazyColisExpedition = lazy(() => import('@/pages/colis/ColisExpeditionModernFixed'));
export const LazyColisTracking = lazy(() => import('@/pages/colis/ColisTracking'));
export const LazyColisTrackingPublic = lazy(() => import('@/pages/ColisTracking'));
export const LazyColisExpeditionComplete = lazy(() => import('@/pages/colis/ColisExpeditionModernFixed'));
export const LazyExpeditionConfirmation = lazy(() => import('@/pages/colis/ExpeditionConfirmationPage'));
export const LazyColisAuthPage = lazy(() => import('@/pages/colis/ColisAuthPage'));
export const LazyColisNationalPage = lazy(() => import('@/pages/colis/ColisNationalPage'));
export const LazyColisInternationalPage = lazy(() => import('@/pages/colis/ColisInternationalPage'));
export const LazyColisTarifsPage = lazy(() => import('@/pages/colis/ColisTarifsPage'));
export const LazyColisSupportPage = lazy(() => import('@/pages/colis/ColisSupportPage'));
export const LazyColisFAQPage = lazy(() => import('@/pages/colis/ColisFAQPage'));

// ===== PAGES DE TAXI =====
export const LazyTaxi = lazy(() => import('@/pages/Taxi'));
export const LazyTaxiBooking = lazy(() => import('@/pages/taxi/Booking'));
export const LazyTaxiHistory = lazy(() => import('@/pages/taxi/History'));
export const LazyTaxiSubscription = lazy(() => import('@/pages/taxi/Subscription'));
export const LazyTaxiBusiness = lazy(() => import('@/pages/taxi/Business'));
export const LazyTaxiRideStatus = lazy(() => import('@/pages/taxi/RideStatus'));
export const LazyTaxiLocations = lazy(() => import('@/pages/taxi/Locations'));

// ===== PAGES DE LIVRAISON =====
export const LazyDelivery = lazy(() => import('@/pages/Delivery'));
export const LazyDeliveryDashboard = lazy(() => import('@/pages/delivery/Dashboard'));
export const LazyDeliveryMapPage = lazy(() => import('@/pages/delivery/MapPage'));

// ===== PAGES DE RESTAURANT =====
export const LazyRestaurantDashboard = lazy(() => import('@/pages/restaurant/Dashboard'));
export const LazyRestaurantManagement = lazy(() => import('@/pages/restaurant/ManagementPage'));
export const LazyRestaurantIntelligence = lazy(() => import('@/pages/restaurant/Intelligence'));
export const LazyRestaurantSubscriptionPlans = lazy(() => import('@/pages/restaurant/SubscriptionPlans'));

// ===== PAGES D'ANALYTICS ET ADMIN =====
export const LazyAnalyticsDashboard = lazy(() => import('@/pages/analytics/Dashboard'));
export const LazyKitchenDashboard = lazy(() => import('@/pages/kitchen/Dashboard'));
export const LazyAdmin = lazy(() => import('@/pages/Admin'));
export const LazyAdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
export const LazyAdminUsers = lazy(() => import('@/pages/admin/Users'));
export const LazyAdminFeatureFlags = lazy(() => import('@/pages/admin/FeatureFlags'));

// ===== PAGES DE WALLET =====
export const LazyWallet = lazy(() => import('@/pages/Wallet'));
export const LazyWalletOverview = lazy(() => import('@/pages/Wallet/WalletOverview'));
export const LazyWalletTransactions = lazy(() => import('@/pages/wallet/Transactions'));
export const LazyWalletDeposit = lazy(() => import('@/pages/wallet/Deposit'));
export const LazyWalletWithdraw = lazy(() => import('@/pages/wallet/Withdraw'));
export const LazyWalletInvoices = lazy(() => import('@/pages/wallet/Invoices'));
export const LazyWalletPaymentMethods = lazy(() => import('@/pages/wallet/PaymentMethods'));
export const LazyWalletAnalytics = lazy(() => import('@/pages/wallet/Analytics'));

// ===== PAGES DE COVOITURAGE =====
export const LazyCovoiturage = lazy(() => import('@/pages/Covoiturage'));
export const LazyCovoiturageBooking = lazy(() => import('@/pages/covoiturage/Booking'));
export const LazyCovoiturageDetails = lazy(() => import('@/pages/covoiturage/Details'));
export const LazyCovoiturageMyRides = lazy(() => import('@/pages/covoiturage/MyRides'));

// ===== PAGES D'INFORMATION =====
export const LazyAbout = lazy(() => import('@/pages/About'));
export const LazyContact = lazy(() => import('@/pages/Contact'));
export const LazyTerms = lazy(() => import('@/pages/Terms'));
export const LazyPrivacy = lazy(() => import('@/pages/Privacy'));
export const LazyCareers = lazy(() => import('@/pages/Careers'));
export const LazyFAQ = lazy(() => import('@/pages/FAQ'));
export const LazyHelp = lazy(() => import('@/pages/Help'));
export const LazyLegal = lazy(() => import('@/pages/Legal'));
export const LazyCGU = lazy(() => import('@/pages/CGU'));

// ===== PAGES DE COMMANDES =====
export const LazyOrder = lazy(() => import('@/pages/Order'));
export const LazyOrders = lazy(() => import('@/pages/Orders'));
export const LazyOrderDetails = lazy(() => import('@/pages/OrderDetails'));
export const LazyOrderTracking = lazy(() => import('@/pages/OrderTracking'));
export const LazyOrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
export const LazyOrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
export const LazyCart = lazy(() => import('@/pages/Cart'));
export const LazyCartPage = lazy(() => import('@/pages/CartPage'));
export const LazyCheckout = lazy(() => import('@/pages/Checkout'));

// ===== PAGES DE NOTIFICATIONS ET MESSAGES =====
// export const LazyNotifications = lazy(() => import('@/pages/Notifications'));
// export const LazyNotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
export const LazyMessages = lazy(() => import('@/pages/Messages'));

// ===== PAGES DE LOYALTY ET RÉFÉRENCES =====
export const LazyLoyalty = lazy(() => import('@/pages/Loyalty'));
export const LazyLoyaltyRewards = lazy(() => import('@/pages/loyalty/Rewards'));
export const LazyReferralProgram = lazy(() => import('@/pages/ReferralProgram'));

// ===== PAGES DE SERVICES SPÉCIALISÉS =====
export const LazyServices = lazy(() => import('@/pages/Services'));
export const LazyProfessionalServices = lazy(() => import('@/pages/ProfessionalServices'));
export const LazyEntertainment = lazy(() => import('@/pages/Entertainment'));
export const LazyRealEstate = lazy(() => import('@/pages/RealEstate'));
export const LazyHotel = lazy(() => import('@/pages/Hotel'));
export const LazyLocationVoiture = lazy(() => import('@/pages/LocationVoiture'));
export const LazyFinance = lazy(() => import('@/pages/Finance'));
export const LazyEducation = lazy(() => import('@/pages/Education'));

// ===== PAGES DE RECHERCHE ET EXPLORATION =====
export const LazySearch = lazy(() => import('@/pages/Search'));
export const LazyExplorer = lazy(() => import('@/pages/Explorer'));
export const LazyFavorites = lazy(() => import('@/pages/Favorites'));
export const LazyGallery = lazy(() => import('@/pages/Gallery'));
export const LazyBlog = lazy(() => import('@/pages/Blog'));

// ===== PAGES DE PARTENAIRES ET MARKETING =====
export const LazyPartners = lazy(() => import('@/pages/Partners'));
export const LazyDeals = lazy(() => import('@/pages/Deals'));
export const LazyCashback = lazy(() => import('@/pages/Cashback'));

// ===== PAGES DE GESTION =====
export const LazyAvailability = lazy(() => import('@/pages/Availability'));
export const LazyFeatureFlags = lazy(() => import('@/pages/FeatureFlags'));
export const LazyCallCenter = lazy(() => import('@/pages/CallCenter'));
export const LazyHealth = lazy(() => import('@/pages/Health'));

// ===== COMPOSANTS LOURDS (chargés à la demande) =====
export const LazyRealTimeTracking = lazy(() => import('@/components/tracking/RealTimeTracking'));
export const LazyEnhancedMenuView = lazy(() => import('@/components/restaurant/EnhancedMenuView'));
export const LazyDeliveryManagement = lazy(() => import('@/components/restaurant/DeliveryManagement'));
export const LazyLiveTracking = lazy(() => import('@/components/delivery/LiveTracking'));
export const LazyDeliveryDriverTracking = lazy(() => import('@/components/delivery/DeliveryDriverTracking'));
export const LazyRestaurantAnalytics = lazy(() => import('@/components/restaurant/RestaurantAnalytics'));
export const LazyRestaurantIntelligenceComponent = lazy(() => import('@/components/restaurant/RestaurantIntelligence'));
export const LazyAdvancedAnalytics = lazy(() => import('@/components/restaurant/AdvancedAnalytics'));
export const LazyRouteOptimization = lazy(() => import('@/components/delivery/RouteOptimization'));
export const LazyColisMap = lazy(() => import('@/components/colis/ColisMap'));
export const LazyColisCoverageMap = lazy(() => import('@/components/colis/ColisCoverageMap'));
export const LazyRelayPointsMap = lazy(() => import('@/components/colis/RelayPointsMap'));
export const LazyTaxiMap = lazy(() => import('@/components/taxi/TaxiMap'));
export const LazyDeliveryMap = lazy(() => import('@/components/DeliveryMap'));
export const LazyRestaurantMap = lazy(() => import('@/components/restaurants/RestaurantMap'));
export const LazyRidesharingMap = lazy(() => import('@/components/ridesharing/RidesharingMap'));

// ===== COMPOSANTS DE FORMULAIRES COMPLEXES =====
export const LazyTaxiBookingForm = lazy(() => import('@/components/taxi/TaxiBookingForm'));
export const LazyColisShippingForm = lazy(() => import('@/components/colis/ColisShippingForm'));
export const LazyAddressForm = lazy(() => import('@/components/colis/AddressForm'));
export const LazyPaymentForm = lazy(() => import('@/components/payment/PaymentForm'));
export const LazyCardPaymentForm = lazy(() => import('@/components/payment/CardPaymentForm'));

// ===== COMPOSANTS D'ANALYTICS ET DASHBOARDS =====
export const LazyDashboardChart = lazy(() => import('@/components/DashboardChart'));
export const LazyDashboardBarChart = lazy(() => import('@/components/DashboardBarChart'));
export const LazyUserStats = lazy(() => import('@/components/stats/UserStats'));
export const LazyColisAnalytics = lazy(() => import('@/components/colis/ColisAnalytics'));
export const LazyColisRealTimeStats = lazy(() => import('@/components/colis/ColisRealTimeStats'));

// ===== COMPOSANTS DE NOTIFICATIONS ET CHAT =====
export const LazyLiveNotifications = lazy(() => import('@/components/notifications/LiveNotifications'));
export const LazyNotificationCenter = lazy(() => import('@/components/notifications/NotificationCenter'));
export const LazyChatBot = lazy(() => import('@/components/ChatBot'));
export const LazyLiveChat = lazy(() => import('@/components/chat/LiveChat'));
export const LazyAIChat = lazy(() => import('@/components/chat/AIChat'));
export const LazyColisAIChatbot = lazy(() => import('@/components/colis/ColisAIChatbot'));

// ===== COMPOSANTS DE GESTION D'ENTREPRISE =====
// export const LazyInventoryManager = lazy(() => import('@/components/inventory/InventoryManager'));
export const LazyCallCenterDashboard = lazy(() => import('@/components/call-center/CallCenterDashboard'));
export const LazyCallCenterTicketList = lazy(() => import('@/components/call-center/CallCenterTicketList'));
export const LazyAdminDemoDataManager = lazy(() => import('@/pages/admin/DemoDataManager'));
export const LazyAdminN8NWorkflowManager = lazy(() => import('@/pages/admin/N8NWorkflowManager'));

// ===== FALLBACK UNIVERSEL =====
export const lazyFallback = React.createElement('div', {
  className: 'flex items-center justify-center min-h-[200px] p-4'
}, [
  React.createElement('div', {
    key: 'spinner',
    className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary'
  }),
  React.createElement('p', {
    key: 'text',
    className: 'ml-3 text-sm text-gray-500'
  }, 'Chargement...')
]);

// ===== HOOK POUR GÉRER LE LAZY LOADING =====
export const useLazyLoading = () => {
  return {
    fallback: lazyFallback,
    // Options de retry, timeout, etc.
    retryCount: 3,
    retryDelay: 1000,
  };
};

// ===== GROUPE DE CHUNKS POUR OPTIMISATION =====
export const chunkGroups = {
  // Pages principales (chargées ensemble)
  main: [
    'LazyIndex',
    'LazyHome',
    'LazyAuthPage',
    'LazyLogin',
    'LazyRegister',
    'LazyRestaurants',
    'LazyDashboard',
    'LazyProfile'
  ],
  
  // Services (chargés ensemble)
  services: [
    'LazyCoiffure',
    'LazyPlomberie',
    'LazyTransport',
    'LazyJuridique',
    'LazyDecoration',
    'LazyUrgent',
    'LazyComptabilite',
    'LazyMenage',
    'LazyElectricite',
    'LazyLogistique',
    'LazyChefDomicile'
  ],
  
  // Colis (module spécialisé)
  colis: [
    'LazyColisDashboard',
    'LazyColisExpedition',
    'LazyColisTracking',
    'LazyColisTrackingPublic',
    'LazyColisExpeditionComplete',
    'LazyColisAuthPage',
    'LazyColisNationalPage',
    'LazyColisInternationalPage',
    'LazyColisTarifsPage',
    'LazyColisSupportPage',
    'LazyColisFAQPage'
  ],
  
  // Taxi
  taxi: [
    'LazyTaxi',
    'LazyTaxiBooking',
    'LazyTaxiHistory',
    'LazyTaxiSubscription',
    'LazyTaxiBusiness',
    'LazyTaxiRideStatus',
    'LazyTaxiLocations'
  ],
  
  // Cartes et tracking (composants lourds)
  maps: [
    'LazyRealTimeTracking',
    'LazyColisMap',
    'LazyColisCoverageMap',
    'LazyRelayPointsMap',
    'LazyTaxiMap',
    'LazyDeliveryMap',
    'LazyRestaurantMap',
    'LazyRidesharingMap'
  ],
  
  // Analytics et dashboards
  analytics: [
    'LazyAnalyticsDashboard',
    'LazyKitchenDashboard',
    'LazyDashboardChart',
    'LazyDashboardBarChart',
    'LazyUserStats',
    'LazyColisAnalytics',
    'LazyColisRealTimeStats'
  ]
}; 