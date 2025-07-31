import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Code, 
  Play, 
  Copy, 
  Check,
  Package,
  BarChart3,
  Bell,
  MapPin,
  CreditCard
} from 'lucide-react';

interface ComponentExample {
  name: string;
  description: string;
  code: string;
  component: React.ReactNode;
  props?: Record<string, any>;
}

const ColisComponentDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(name);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const componentExamples: ComponentExample[] = [
    {
      name: 'ColisTrackingCard',
      description: 'Carte de suivi de colis avec timeline et actions',
      code: `import { ColisTrackingCard } from '@/components/colis';

const trackingData = {
  id: 'BD12345678',
  status: 'En cours de livraison',
  sender: 'Jean Dupont',
  recipient: 'Marie Martin',
  from: 'Brazzaville',
  to: 'Pointe-Noire',
  estimatedDelivery: '2024-07-20T10:00:00Z',
  weight: '2.5kg',
  price: 2500,
  type: 'national' as const,
  events: [
    {
      id: '1',
      status: 'Colis pris en charge',
      location: 'Brazzaville',
      timestamp: '2024-07-18T09:00:00Z',
      description: 'Votre colis a été récupéré',
      icon: 'package' as const
    }
  ]
};

<ColisTrackingCard 
  colis={trackingData}
  onDownloadLabel={(id) => console.log('Download:', id)}
  onResend={(id) => console.log('Resend:', id)}
/>`,
      component: (
        <div className="p-4 bg-gray-50 rounded-lg">
          <Package className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="font-semibold text-gray-800">BD12345678</h3>
          <Badge className="bg-orange-100 text-orange-800">En cours de livraison</Badge>
        </div>
      )
    },
    {
      name: 'ColisRealTimeStats',
      description: 'Statistiques en temps réel avec animations',
      code: `import { ColisRealTimeStats } from '@/components/colis';

<ColisRealTimeStats 
  refreshInterval={30000}
  showAnimations={true}
/>`,
      component: (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">1,247</div>
            <div className="text-sm text-orange-700">Total Expéditions</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-green-700">Livrés Aujourd'hui</div>
          </div>
        </div>
      )
    },
    {
      name: 'ColisNotificationCenter',
      description: 'Centre de notifications avec filtres et actions',
      code: `import { ColisNotificationCenter } from '@/components/colis';

<ColisNotificationCenter 
  maxNotifications={50}
  onMarkAsRead={(id) => console.log('Mark as read:', id)}
  onMarkAllAsRead={() => console.log('Mark all as read')}
  onDelete={(id) => console.log('Delete:', id)}
/>`,
      component: (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-800">Centre de notifications</span>
            <Badge className="bg-red-500 text-white text-xs">3</Badge>
          </div>
          <p className="text-sm text-blue-700">3 notifications non lues</p>
        </div>
      )
    },
    {
      name: 'ColisShippingForm',
      description: 'Formulaire d\'expédition multi-étapes avec validation',
      code: `import { ColisShippingForm } from '@/components/colis';

<ColisShippingForm 
  onSubmit={(data) => console.log('Form submitted:', data)}
  onCalculatePrice={(data) => {
    // Logique de calcul de prix
    return 2500;
  }}
  isLoading={false}
/>`,
      component: (
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-green-800">Formulaire d'expédition</span>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">Étape 1</Badge>
            <Badge className="bg-gray-100 text-gray-600">Étape 2</Badge>
            <Badge className="bg-gray-100 text-gray-600">Étape 3</Badge>
          </div>
        </div>
      )
    },
    {
      name: 'ColisPricingCard',
      description: 'Cartes de tarification avec comparaison',
      code: `import { ColisPricingCard } from '@/components/colis';

<ColisPricingCard 
  showComparison={true}
  showFeatures={true}
  onSelectPlan={(plan) => console.log('Selected plan:', plan)}
/>`,
      component: (
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <span className="font-semibold text-purple-800">Cartes de tarification</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-purple-600">Basic</div>
              <div className="text-sm text-purple-700">2,500 FCFA</div>
            </div>
            <div className="text-center p-2 bg-purple-100 rounded border-2 border-purple-300">
              <div className="font-bold text-purple-600">Pro</div>
              <div className="text-sm text-purple-700">15,000 FCFA</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-purple-600">Enterprise</div>
              <div className="text-sm text-purple-700">50,000 FCFA</div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'ColisAnalytics',
      description: 'Tableau de bord analytique avec graphiques',
      code: `import { ColisAnalytics } from '@/components/colis';

<ColisAnalytics 
  onPeriodChange={(period) => console.log('Period changed:', period)}
  onExport={() => console.log('Export data')}
/>`,
      component: (
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <span className="font-semibold text-indigo-800">Analytics & Rapports</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">1,247</div>
              <div className="text-sm text-indigo-700">Expéditions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">2.8M</div>
              <div className="text-sm text-indigo-700">FCFA</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Documentation des Composants Colis</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Guide complet pour utiliser les composants du module Colis. 
          Chaque composant inclut des exemples de code, des props et des cas d'usage.
        </p>
      </div>

      {/* Navigation par onglets */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="components">Composants</TabsTrigger>
          <TabsTrigger value="examples">Exemples</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture des Composants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Composants de Base</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>ColisNavigation</strong> - Navigation principale</li>
                    <li>• <strong>ColisBreadcrumbs</strong> - Fil d'Ariane</li>
                    <li>• <strong>ColisStats</strong> - Statistiques simples</li>
                    <li>• <strong>ColisSearch</strong> - Recherche avancée</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Composants Avancés</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>ColisTrackingCard</strong> - Suivi de colis</li>
                    <li>• <strong>ColisShippingForm</strong> - Formulaire d'expédition</li>
                    <li>• <strong>ColisAnalytics</strong> - Tableau de bord</li>
                    <li>• <strong>ColisNotificationCenter</strong> - Notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Installation et Utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>// Import des composants</div>
                <div>import {'{'} ColisTrackingCard, ColisStats {'}'} from '@/components/colis';</div>
                <br />
                <div>// Utilisation</div>
                <div>&lt;ColisTrackingCard colis=&#123;data&#125; /&gt;</div>
                <div>&lt;ColisStats stats=&#123;statsData&#125; /&gt;</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          {componentExamples.map((example) => (
            <Card key={example.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {example.component}
                      <span className="text-lg font-bold text-gray-800">{example.name}</span>
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{example.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, example.name)}
                    className="border-orange-300 text-orange-700"
                  >
                    {copiedCode === example.name ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedCode === example.name ? 'Copié !' : 'Copier le code'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{example.code}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemples d'Intégration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Dashboard Complet</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>import {'{'} ColisStats, ColisAnalytics, ColisNotificationCenter {'}'} from '@/components/colis';</div>
                    <br />
                    <div>function Dashboard() {'{'}</div>
                    <div>  return (</div>
                    <div>    &lt;div className="space-y-6"&gt;</div>
                    <div>      &lt;ColisStats stats=&#123;stats&#125; /&gt;</div>
                    <div>      &lt;ColisAnalytics data=&#123;analytics&#125; /&gt;</div>
                    <div>      &lt;ColisNotificationCenter /&gt;</div>
                    <div>    &lt;/div&gt;</div>
                    <div>  );</div>
                    <div>{'}'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Page de Suivi</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>import {'{'} ColisTrackingCard, ColisMap {'}'} from '@/components/colis';</div>
                    <br />
                    <div>function TrackingPage() {'{'}</div>
                    <div>  return (</div>
                    <div>    &lt;div className="grid lg:grid-cols-2 gap-6"&gt;</div>
                    <div>      &lt;ColisTrackingCard colis=&#123;colisData&#125; /&gt;</div>
                    <div>      &lt;ColisMap trackingData=&#123;trackingData&#125; /&gt;</div>
                    <div>    &lt;/div&gt;</div>
                    <div>  );</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Types TypeScript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`// Types principaux
interface ColisData {
  id: string;
  status: string;
  sender: string;
  recipient: string;
  from: string;
  to: string;
  date: string;
  price: number;
  weight: string;
  type: 'national' | 'international';
}

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: 'package' | 'truck' | 'check' | 'alert';
}

interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  colisId?: string;
}`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Props Communes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Props de Style</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <code>className</code> - Classes CSS personnalisées</li>
                    <li>• <code>showAnimations</code> - Activer/désactiver les animations</li>
                    <li>• <code>variant</code> - Variante du composant</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Props de Données</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <code>data</code> - Données principales</li>
                    <li>• <code>loading</code> - État de chargement</li>
                    <li>• <code>error</code> - Gestion d'erreur</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Props d'Événements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <code>onClick</code> - Gestionnaire de clic</li>
                    <li>• <code>onChange</code> - Gestionnaire de changement</li>
                    <li>• <code>onSubmit</code> - Gestionnaire de soumission</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColisComponentDocs; 