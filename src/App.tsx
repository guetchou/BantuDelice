
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { NavigationProvider } from './contexts/NavigationContext'
import Loading from './components/Loading'

// Import routes
import mainRoutes from './routes/mainRoutes'
import { authRoutes } from './routes/authRoutes'
import { adminRoutes } from './routes/adminRoutes'
import { errorRoutes } from './routes/errorRoutes'

function App() {
  // Combine all routes
  const allRoutes = [...mainRoutes, ...authRoutes, ...adminRoutes, ...errorRoutes]
  const routes = useRoutes(allRoutes)

  return (
    <NavigationProvider>
      <Suspense fallback={<Loading />}>
        {routes}
      </Suspense>
      <Toaster position="top-right" />
    </NavigationProvider>
  )
}

export default App
