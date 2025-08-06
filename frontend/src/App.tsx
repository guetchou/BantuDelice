import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/NotificationContainer';
import { ColisProvider } from '@/context/ColisContext';
import { ColisAuthProvider } from '@/context/ColisAuthContext';
import FloatingGalleryButton from '@/components/FloatingGalleryButton';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import AccessibilityShortcuts from '@/components/AccessibilityShortcuts';
import ContextTransition from '@/components/navigation/ContextTransition';
import MainLayout from '@/layouts/MainLayout';

const App = () => {
  return (
    <AccessibilityProvider>
      <HelmetProvider>
        <ThemeProvider>
          <NotificationProvider>
            <ColisAuthProvider>
              <ColisProvider>
                <ContextTransition>
                  <ErrorBoundary>
                    <MainLayout />
                  </ErrorBoundary>
                  <NotificationContainer />
                  <FloatingGalleryButton />
                  <AccessibilityShortcuts />
                </ContextTransition>
              </ColisProvider>
            </ColisAuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </HelmetProvider>
    </AccessibilityProvider>
  );
};

export default App;
