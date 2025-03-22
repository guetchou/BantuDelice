
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeliveryPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Livraison - Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader>
            <CardTitle>Tableau de bord Livreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Accédez à votre tableau de bord de livraison pour voir vos commandes en cours et votre historique.</p>
            <Button 
              onClick={() => navigate('/delivery/Dashboard')} 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
            >
              Accéder au tableau de bord
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestion des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Gérez les livraisons en cours, assignez des livreurs et suivez l'état des commandes.</p>
            <Button onClick={() => navigate('/orders')}>
              Voir les commandes
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suivi de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Suivez en temps réel l'état de vos livraisons et la position des coursiers.</p>
            <Button onClick={() => navigate('/delivery/tracking')}>
              Suivre une livraison
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryPage;
