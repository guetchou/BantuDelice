
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDashboard from '@/components/restaurant/RestaurantDashboard';

const RestaurantDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout backLink="/restaurants" backText="Retour aux restaurants">
      <div className="container mx-auto py-6">
        <RestaurantDashboard restaurantId={id || ''} />
      </div>
    </Layout>
  );
};

export default RestaurantDashboardPage;
