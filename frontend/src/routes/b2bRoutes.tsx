import React from 'react';
import { Route } from 'react-router-dom';
import { lazy } from 'react';

// Lazy imports pour les nouvelles fonctionnalités
const B2BDashboard = lazy(() => import('@/pages/b2b/B2BDashboard'));
const Marketplace = lazy(() => import('@/pages/ecommerce/Marketplace'));
const ExecutiveDashboard = lazy(() => import('@/pages/admin/ExecutiveDashboard'));

// Routes B2B
export const b2bRoutes = (
  <>
    <Route path="/b2b/dashboard" element={<B2BDashboard />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/admin/executive" element={<ExecutiveDashboard />} />
  </>
); 