
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import { NavigationProvider } from './contexts/NavigationContext'
import Loading from './components/Loading'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home'))
const AuthPage = lazy(() => import('./pages/Auth'))
const RestaurantManagementPage = lazy(() => import('./pages/restaurant/ManagementPage'))
const RestaurantDashboard = lazy(() => import('./pages/restaurant/Dashboard'))
const RestaurantDetailsPage = lazy(() => import('./pages/RestaurantDetails'))
const RestaurantsPage = lazy(() => import('./pages/Restaurants'))

function App() {
  return (
    <NavigationProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
            <Route path="/restaurant/management/:id" element={<RestaurantManagementPage />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            {/* Autres routes seront ajoutées ici */}
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </NavigationProvider>
  )
}

export default App
