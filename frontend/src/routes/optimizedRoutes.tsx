import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  LazyIndex, LazyHome, LazyAuthPage, LazyLogin, LazyRegister,
  LazyRestaurants, LazyRestaurantDetails, LazyDashboard, LazyProfile,
  LazyCoiffure, LazyPlomberie, LazyTransport, LazyJuridique,
  LazyDecoration, LazyUrgent, LazyComptabilite, LazyMenage,
  LazyElectricite, LazyLogistique, LazyChefDomicile,
  LazyColisDashboard, LazyColisExpedition, LazyColisTracking,
  LazyColisTrackingPublic, LazyColisExpeditionComplete,
  LazyTaxi, LazyTaxiBooking, LazyTaxiHistory, LazyTaxiSubscription,
  LazyDelivery, LazyDeliveryDashboard, LazyDeliveryMapPage,
  LazyAnalyticsDashboard, LazyKitchenDashboard, LazyAdmin,
  LazyWallet, LazyWalletOverview, LazyWalletTransactions,
  LazyCovoiturage, LazyCovoiturageBooking, LazyCovoiturageDetails,
  LazyAbout, LazyContact, LazyTerms, LazyPrivacy, LazyCareers,
  LazyOrder, LazyOrders, LazyOrderDetails, LazyOrderTracking,
  LazyCart, LazyCheckout, LazyNotifications, LazyMessages,
  LazyLoyalty, LazyServices, LazySearch, LazyExplorer,
  LazyFavorites, LazyGallery, LazyBlog, LazyPartners,
  LazyDeals, LazyCashback, LazyAvailability, LazyFeatureFlags,
  LazyCallCenter, LazyHealth, LazySettings, LazyFAQ, LazyHelp,
  LazyLegal, LazyCGU, LazyOrderSuccess, LazyOrderConfirmation,
  LazyCartPage, LazyNotificationsPage, LazyLoyaltyRewards,
  LazyReferralProgram, LazyProfessionalServices, LazyEntertainment,
  LazyRealEstate, LazyHotel, LazyLocationVoiture, LazyFinance,
  LazyEducation, LazyTaxiRideStatus, LazyTaxiLocations,
  LazyTaxiBusiness, LazyRestaurantDashboard, LazyRestaurantManagement,
  LazyRestaurantIntelligenceComponent, LazyRestaurantSubscriptionPlans,
  LazyAdminDashboard, LazyAdminUsers, LazyAdminFeatureFlags,
  LazyWalletDeposit, LazyWalletWithdraw, LazyWalletInvoices,
  LazyWalletPaymentMethods, LazyWalletAnalytics, LazyCovoiturageMyRides,
  LazyColisAuthPage, LazyColisNationalPage, LazyColisInternationalPage,
  LazyColisTarifsPage, LazyColisSupportPage, LazyColisFAQPage,
  lazyFallback
} from '@/utils/lazyImports';

// Composant de fallback optimisé
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-500">Chargement de la page...</p>
    </div>
  </div>
);

// Routeur optimisé avec lazy loading
export const OptimizedRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes principales */}
      <Route path="/" element={
        <Suspense fallback={<PageFallback />}>
          <LazyIndex />
        </Suspense>
      } />
      
      <Route path="/home" element={
        <Suspense fallback={<PageFallback />}>
          <LazyHome />
        </Suspense>
      } />
      
      <Route path="/auth" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAuthPage />
        </Suspense>
      } />
      
      <Route path="/login" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLogin />
        </Suspense>
      } />
      
      <Route path="/register" element={
        <Suspense fallback={<PageFallback />}>
          <LazyRegister />
        </Suspense>
      } />
      
      <Route path="/restaurants" element={
        <Suspense fallback={<PageFallback />}>
          <LazyRestaurants />
        </Suspense>
      } />
      
      <Route path="/restaurant/:id" element={
        <Suspense fallback={<PageFallback />}>
          <LazyRestaurantDetails />
        </Suspense>
      } />
      
      <Route path="/dashboard" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDashboard />
        </Suspense>
      } />
      
      <Route path="/profile" element={
        <Suspense fallback={<PageFallback />}>
          <LazyProfile />
        </Suspense>
      } />
      
      <Route path="/settings" element={
        <Suspense fallback={<PageFallback />}>
          <LazySettings />
        </Suspense>
      } />
      
      {/* Routes de services */}
      <Route path="/services/coiffure" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCoiffure />
        </Suspense>
      } />
      
      <Route path="/services/plomberie" element={
        <Suspense fallback={<PageFallback />}>
          <LazyPlomberie />
        </Suspense>
      } />
      
      <Route path="/services/transport" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTransport />
        </Suspense>
      } />
      
      <Route path="/services/juridique" element={
        <Suspense fallback={<PageFallback />}>
          <LazyJuridique />
        </Suspense>
      } />
      
      <Route path="/services/decoration" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDecoration />
        </Suspense>
      } />
      
      <Route path="/services/urgent" element={
        <Suspense fallback={<PageFallback />}>
          <LazyUrgent />
        </Suspense>
      } />
      
      <Route path="/services/comptabilite" element={
        <Suspense fallback={<PageFallback />}>
          <LazyComptabilite />
        </Suspense>
      } />
      
      <Route path="/services/menage" element={
        <Suspense fallback={<PageFallback />}>
          <LazyMenage />
        </Suspense>
      } />
      
      <Route path="/services/electricite" element={
        <Suspense fallback={<PageFallback />}>
          <LazyElectricite />
        </Suspense>
      } />
      
      <Route path="/services/logistique" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLogistique />
        </Suspense>
      } />
      
      <Route path="/services/chef-domicile" element={
        <Suspense fallback={<PageFallback />}>
          <LazyChefDomicile />
        </Suspense>
      } />
      
      {/* Routes de colis */}
      <Route path="/colis" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisDashboard />
        </Suspense>
      } />
      
      <Route path="/colis/expedition" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisExpedition />
        </Suspense>
      } />
      
      <Route path="/colis/tracking" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisTracking />
        </Suspense>
      } />
      
      <Route path="/colis/tracking/:trackingNumber" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisTrackingPublic />
        </Suspense>
      } />
      
      <Route path="/colis/expedition-complete" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisExpeditionComplete />
        </Suspense>
      } />
      
      <Route path="/colis/auth" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisAuthPage />
        </Suspense>
      } />
      
      <Route path="/colis/national" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisNationalPage />
        </Suspense>
      } />
      
      <Route path="/colis/international" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisInternationalPage />
        </Suspense>
      } />
      
      <Route path="/colis/tarifs" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisTarifsPage />
        </Suspense>
      } />
      
      <Route path="/colis/support" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisSupportPage />
        </Suspense>
      } />
      
      <Route path="/colis/faq" element={
        <Suspense fallback={<PageFallback />}>
          <LazyColisFAQPage />
        </Suspense>
      } />
      
      {/* Routes de taxi */}
      <Route path="/taxi" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxi />
        </Suspense>
      } />
      
      <Route path="/taxi/booking" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiBooking />
        </Suspense>
      } />
      
      <Route path="/taxi/history" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiHistory />
        </Suspense>
      } />
      
      <Route path="/taxi/subscription" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiSubscription />
        </Suspense>
      } />
      
      <Route path="/taxi/business" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiBusiness />
        </Suspense>
      } />
      
      <Route path="/taxi/ride-status" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiRideStatus />
        </Suspense>
      } />
      
      <Route path="/taxi/locations" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTaxiLocations />
        </Suspense>
      } />
      
      {/* Routes de livraison */}
      <Route path="/delivery" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDelivery />
        </Suspense>
      } />
      
      <Route path="/delivery/dashboard" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDeliveryDashboard />
        </Suspense>
      } />
      
      <Route path="/delivery/map" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDeliveryMapPage />
        </Suspense>
      } />
      
      {/* Routes d'analytics et admin */}
      <Route path="/analytics" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAnalyticsDashboard />
        </Suspense>
      } />
      
      <Route path="/kitchen" element={
        <Suspense fallback={<PageFallback />}>
          <LazyKitchenDashboard />
        </Suspense>
      } />
      
      <Route path="/admin" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAdmin />
        </Suspense>
      } />
      
      <Route path="/admin/dashboard" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAdminDashboard />
        </Suspense>
      } />
      
      <Route path="/admin/users" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAdminUsers />
        </Suspense>
      } />
      
      <Route path="/admin/feature-flags" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAdminFeatureFlags />
        </Suspense>
      } />
      
      {/* Routes de wallet */}
      <Route path="/wallet" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWallet />
        </Suspense>
      } />
      
      <Route path="/wallet/overview" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletOverview />
        </Suspense>
      } />
      
      <Route path="/wallet/transactions" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletTransactions />
        </Suspense>
      } />
      
      <Route path="/wallet/deposit" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletDeposit />
        </Suspense>
      } />
      
      <Route path="/wallet/withdraw" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletWithdraw />
        </Suspense>
      } />
      
      <Route path="/wallet/invoices" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletInvoices />
        </Suspense>
      } />
      
      <Route path="/wallet/payment-methods" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletPaymentMethods />
        </Suspense>
      } />
      
      <Route path="/wallet/analytics" element={
        <Suspense fallback={<PageFallback />}>
          <LazyWalletAnalytics />
        </Suspense>
      } />
      
      {/* Routes de covoiturage */}
      <Route path="/covoiturage" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCovoiturage />
        </Suspense>
      } />
      
      <Route path="/covoiturage/booking" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCovoiturageBooking />
        </Suspense>
      } />
      
      <Route path="/covoiturage/details" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCovoiturageDetails />
        </Suspense>
      } />
      
      <Route path="/covoiturage/my-rides" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCovoiturageMyRides />
        </Suspense>
      } />
      
      {/* Routes d'information */}
      <Route path="/about" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAbout />
        </Suspense>
      } />
      
      <Route path="/contact" element={
        <Suspense fallback={<PageFallback />}>
          <LazyContact />
        </Suspense>
      } />
      
      <Route path="/terms" element={
        <Suspense fallback={<PageFallback />}>
          <LazyTerms />
        </Suspense>
      } />
      
      <Route path="/privacy" element={
        <Suspense fallback={<PageFallback />}>
          <LazyPrivacy />
        </Suspense>
      } />
      
      <Route path="/careers" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCareers />
        </Suspense>
      } />
      
      <Route path="/faq" element={
        <Suspense fallback={<PageFallback />}>
          <LazyFAQ />
        </Suspense>
      } />
      
      <Route path="/help" element={
        <Suspense fallback={<PageFallback />}>
          <LazyHelp />
        </Suspense>
      } />
      
      <Route path="/legal" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLegal />
        </Suspense>
      } />
      
      <Route path="/cgu" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCGU />
        </Suspense>
      } />
      
      {/* Routes de commandes */}
      <Route path="/order" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrder />
        </Suspense>
      } />
      
      <Route path="/orders" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrders />
        </Suspense>
      } />
      
      <Route path="/order/:id" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrderDetails />
        </Suspense>
      } />
      
      <Route path="/order-tracking" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrderTracking />
        </Suspense>
      } />
      
      <Route path="/order-success" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrderSuccess />
        </Suspense>
      } />
      
      <Route path="/order-confirmation" element={
        <Suspense fallback={<PageFallback />}>
          <LazyOrderConfirmation />
        </Suspense>
      } />
      
      <Route path="/cart" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCart />
        </Suspense>
      } />
      
      <Route path="/cart-page" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCartPage />
        </Suspense>
      } />
      
      <Route path="/checkout" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCheckout />
        </Suspense>
      } />
      
      {/* Routes de notifications et messages */}
      <Route path="/notifications" element={
        <Suspense fallback={<PageFallback />}>
          <LazyNotifications />
        </Suspense>
      } />
      
      <Route path="/notifications-page" element={
        <Suspense fallback={<PageFallback />}>
          <LazyNotificationsPage />
        </Suspense>
      } />
      
      <Route path="/messages" element={
        <Suspense fallback={<PageFallback />}>
          <LazyMessages />
        </Suspense>
      } />
      
      {/* Routes de loyalty et références */}
      <Route path="/loyalty" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLoyalty />
        </Suspense>
      } />
      
      <Route path="/loyalty/rewards" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLoyaltyRewards />
        </Suspense>
      } />
      
      <Route path="/referral-program" element={
        <Suspense fallback={<PageFallback />}>
          <LazyReferralProgram />
        </Suspense>
      } />
      
      {/* Routes de services spécialisés */}
      <Route path="/services" element={
        <Suspense fallback={<PageFallback />}>
          <LazyServices />
        </Suspense>
      } />
      
      <Route path="/professional-services" element={
        <Suspense fallback={<PageFallback />}>
          <LazyProfessionalServices />
        </Suspense>
      } />
      
      <Route path="/entertainment" element={
        <Suspense fallback={<PageFallback />}>
          <LazyEntertainment />
        </Suspense>
      } />
      
      <Route path="/real-estate" element={
        <Suspense fallback={<PageFallback />}>
          <LazyRealEstate />
        </Suspense>
      } />
      
      <Route path="/hotel" element={
        <Suspense fallback={<PageFallback />}>
          <LazyHotel />
        </Suspense>
      } />
      
      <Route path="/location-voiture" element={
        <Suspense fallback={<PageFallback />}>
          <LazyLocationVoiture />
        </Suspense>
      } />
      
      <Route path="/finance" element={
        <Suspense fallback={<PageFallback />}>
          <LazyFinance />
        </Suspense>
      } />
      
      <Route path="/education" element={
        <Suspense fallback={<PageFallback />}>
          <LazyEducation />
        </Suspense>
      } />
      
      {/* Routes de recherche et exploration */}
      <Route path="/search" element={
        <Suspense fallback={<PageFallback />}>
          <LazySearch />
        </Suspense>
      } />
      
      <Route path="/explorer" element={
        <Suspense fallback={<PageFallback />}>
          <LazyExplorer />
        </Suspense>
      } />
      
      <Route path="/favorites" element={
        <Suspense fallback={<PageFallback />}>
          <LazyFavorites />
        </Suspense>
      } />
      
      <Route path="/gallery" element={
        <Suspense fallback={<PageFallback />}>
          <LazyGallery />
        </Suspense>
      } />
      
      <Route path="/blog" element={
        <Suspense fallback={<PageFallback />}>
          <LazyBlog />
        </Suspense>
      } />
      
      {/* Routes de partenaires et marketing */}
      <Route path="/partners" element={
        <Suspense fallback={<PageFallback />}>
          <LazyPartners />
        </Suspense>
      } />
      
      <Route path="/deals" element={
        <Suspense fallback={<PageFallback />}>
          <LazyDeals />
        </Suspense>
      } />
      
      <Route path="/cashback" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCashback />
        </Suspense>
      } />
      
      {/* Routes de gestion */}
      <Route path="/availability" element={
        <Suspense fallback={<PageFallback />}>
          <LazyAvailability />
        </Suspense>
      } />
      
      <Route path="/feature-flags" element={
        <Suspense fallback={<PageFallback />}>
          <LazyFeatureFlags />
        </Suspense>
      } />
      
      <Route path="/call-center" element={
        <Suspense fallback={<PageFallback />}>
          <LazyCallCenter />
        </Suspense>
      } />
      
      <Route path="/health" element={
        <Suspense fallback={<PageFallback />}>
          <LazyHealth />
        </Suspense>
      } />
      
      {/* Route 404 */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-500 mb-4">Page non trouvée</p>
            <a href="/" className="text-primary hover:underline">
              Retour à l'accueil
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default OptimizedRoutes; 