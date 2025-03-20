
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import { NavigationProvider } from './contexts/NavigationContext'
import Loading from './components/Loading'
import { ThemeProvider } from './components/ui/ThemeProvider'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home'))
const AuthPage = lazy(() => import('./pages/Auth'))
const FormExamplePage = lazy(() => import('./pages/FormExample'))

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <NavigationProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/form-example" element={<FormExamplePage />} />
              {/* Autres routes seront ajoutées ici */}
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </NavigationProvider>
    </ThemeProvider>
  )
}

export default App
