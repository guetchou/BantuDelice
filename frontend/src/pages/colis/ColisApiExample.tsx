import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  useColisWithCache, 
  useNotificationsWithCache, 
  useStatsWithCache,
  useCreateColis,
  usePricing,
  ColisApiError,
  ColisApiLoading,
  ColisApiEmpty
} from '@/services';
import { Package, Bell, BarChart3, Plus, Calculator } from 'lucide-react';

const ColisApiExample: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('BD12345678');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Hooks API avec cache
  const { data: colis, loading: colisLoading, error: colisError, apiStatus } = useColisWithCache(trackingNumber);
  const { notifications, loading: notificationsLoading, error: notificationsError, refresh: refreshNotifications } = useNotificationsWithCache();
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useStatsWithCache();

  // Hooks pour les actions
  const { createColis, loading: createLoading, error: createError, reset: resetCreate } = useCreateColis();
  const { calculatePricing, data: pricingData, loading: pricingLoading, reset: resetPricing } = usePricing();

  const handleCreateColis = async () => {
    try {
      const newColis = await createColis({
        sender: {
          name: 'Jean Dupont',
          phone: '061234567',
          email: 'jean@example.com',
          address: '123 Rue de la Paix',
          city: 'Brazzaville'
        },
        recipient: {
          name: 'Marie Martin',
          phone: '062345678',
          email: 'marie@example.com',
          address: '456 Avenue des Fleurs',
          city: 'Pointe-Noire'
        },
        package: {
          type: 'document',
          weight: 1.5,
          description: 'Documents importants'
        },
        service: {
          type: 'standard',
          insurance: true,
          fragile: false,
          express: false
        }
      });
      
      console.log('Colis créé:', newColis);
      setShowCreateForm(false);
      resetCreate();
    } catch (error) {
      console.error('Erreur création colis:', error);
    }
  };

  const handleCalculatePricing = async () => {
    try {
      await calculatePricing({
        from: 'Brazzaville',
        to: 'Pointe-Noire',
        weight: 2.5,
        type: 'document',
        insurance: true,
        express: false
      });
    } catch (error) {
      console.error('Erreur calcul prix:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Exemple d'Intégration API
          </h1>
          <p className="text-gray-600">
            Démonstration des hooks API avec cache et gestion d'erreurs
          </p>
        </div>

        {/* Statut de l'API */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Statut de l'API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge className={`${
                apiStatus === 'success' ? 'bg-green-100 text-green-800' :
                apiStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                apiStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {apiStatus === 'success' ? 'Connecté' :
                 apiStatus === 'loading' ? 'Chargement' :
                 apiStatus === 'error' ? 'Erreur' : 'Inactif'}
              </Badge>
              <span className="text-sm text-gray-600">
                Dernière synchronisation: {new Date().toLocaleTimeString('fr-FR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Suivi de colis */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Suivi de Colis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Numéro de suivi"
                className="flex-1"
              />
              <Button 
                onClick={() => setTrackingNumber('BD12345678')}
                variant="outline"
              >
                Exemple
              </Button>
            </div>

            {colisError && (
              <ColisApiError 
                error={colisError} 
                onRetry={() => setTrackingNumber(trackingNumber)}
              />
            )}

            {colisLoading && (
              <ColisApiLoading message="Récupération des informations du colis..." />
            )}

            {colis && !colisLoading && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">
                  {colis.trackingNumber}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Expéditeur:</strong> {colis.sender.name}</p>
                    <p><strong>Destinataire:</strong> {colis.recipient.name}</p>
                  </div>
                  <div>
                    <p><strong>Statut:</strong> {colis.status}</p>
                    <p><strong>Prix:</strong> {colis.pricing.totalPrice.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
              </div>
            )}

            {!colis && !colisLoading && !colisError && (
              <ColisApiEmpty 
                title="Aucun colis trouvé"
                message="Entrez un numéro de suivi valide pour voir les informations"
                icon={<Package className="h-12 w-12 text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Statistiques
              </CardTitle>
              <Button 
                onClick={refreshStats}
                disabled={statsLoading}
                size="sm"
                variant="outline"
              >
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {statsError && (
              <ColisApiError 
                error={statsError} 
                onRetry={refreshStats}
              />
            )}

            {statsLoading && (
              <ColisApiLoading message="Chargement des statistiques..." />
            )}

            {stats && !statsLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.totalShipments.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-orange-700">Total Expéditions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.delivered.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-green-700">Livrés</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalRevenue.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-blue-700">FCFA</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.customerSatisfaction}/5
                  </div>
                  <div className="text-sm text-purple-700">Satisfaction</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Notifications ({notifications.length})
              </CardTitle>
              <Button 
                onClick={refreshNotifications}
                disabled={notificationsLoading}
                size="sm"
                variant="outline"
              >
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {notificationsError && (
              <ColisApiError 
                error={notificationsError} 
                onRetry={refreshNotifications}
              />
            )}

            {notificationsLoading && (
              <ColisApiLoading message="Chargement des notifications..." />
            )}

            {notifications.length > 0 && !notificationsLoading && (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <Badge className={`${
                        notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notifications.length === 0 && !notificationsLoading && (
              <ColisApiEmpty 
                title="Aucune notification"
                message="Vous n'avez aucune notification pour le moment"
                icon={<Bell className="h-12 w-12 text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Créer un colis */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" />
                Créer un Colis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {createError && (
                <ColisApiError 
                  error={createError} 
                  onRetry={handleCreateColis}
                  onDismiss={resetCreate}
                />
              )}

              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full"
              >
                {showCreateForm ? 'Annuler' : 'Créer un nouveau colis'}
              </Button>

              {showCreateForm && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700 mb-3">
                    Formulaire simplifié - cliquez pour créer un colis d'exemple
                  </p>
                  <Button 
                    onClick={handleCreateColis}
                    disabled={createLoading}
                    className="w-full"
                  >
                    {createLoading ? 'Création...' : 'Créer le colis'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calculer un prix */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-500" />
                Calculer un Prix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleCalculatePricing}
                disabled={pricingLoading}
                className="w-full"
              >
                {pricingLoading ? 'Calcul...' : 'Calculer un prix d\'exemple'}
              </Button>

              {pricingData && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Prix calculé:</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Prix de base:</strong> {pricingData.basePrice.toLocaleString('fr-FR')} FCFA</p>
                    <p><strong>Assurance:</strong> {pricingData.insuranceFee.toLocaleString('fr-FR')} FCFA</p>
                    <p><strong>Total:</strong> {pricingData.totalPrice.toLocaleString('fr-FR')} FCFA</p>
                    <p><strong>Délai estimé:</strong> {pricingData.estimatedDays} jours</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informations techniques */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Informations Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Hooks Utilisés:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• useColisWithCache - Suivi avec cache</li>
                  <li>• useNotificationsWithCache - Notifications</li>
                  <li>• useStatsWithCache - Statistiques</li>
                  <li>• useCreateColis - Création de colis</li>
                  <li>• usePricing - Calcul de prix</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Fonctionnalités:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Cache automatique des données</li>
                  <li>• Gestion d'erreurs robuste</li>
                  <li>• États de chargement</li>
                  <li>• Synchronisation automatique</li>
                  <li>• Retry automatique</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisApiExample; 