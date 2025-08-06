import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  FileText, 
  Package, 
  Users, 
  Building,
  Truck,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Printer,
  Share2
} from 'lucide-react';

interface BulkShipment {
  id: string;
  clientName: string;
  totalPackages: number;
  totalWeight: number;
  totalValue: number;
  status: 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface PackageItem {
  id: string;
  trackingNumber: string;
  recipient: string;
  address: string;
  weight: number;
  dimensions: string;
  declaredValue: number;
  service: 'standard' | 'express' | 'premium';
  status: 'pending' | 'ready' | 'shipped' | 'delivered';
}

const ColisBulkInterfacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bulkShipments, setBulkShipments] = useState<BulkShipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<BulkShipment | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Simuler des données
  React.useEffect(() => {
    const mockBulkShipments: BulkShipment[] = [
      {
        id: 'BULK-001',
        clientName: 'Entreprise ABC',
        totalPackages: 25,
        totalWeight: 125.5,
        totalValue: 2500000,
        status: 'processing',
        createdAt: new Date('2024-01-15'),
        estimatedDelivery: new Date('2024-01-18'),
        priority: 'high'
      },
      {
        id: 'BULK-002',
        clientName: 'Société XYZ',
        totalPackages: 15,
        totalWeight: 75.2,
        totalValue: 1800000,
        status: 'pending',
        createdAt: new Date('2024-01-14'),
        estimatedDelivery: new Date('2024-01-17'),
        priority: 'medium'
      }
    ];

    const mockPackages: PackageItem[] = [
      {
        id: '1',
        trackingNumber: 'BD123456',
        recipient: 'Jean Dupont',
        address: '123 Rue de la Paix, Brazzaville',
        weight: 2.5,
        dimensions: '30x20x15 cm',
        declaredValue: 50000,
        service: 'express',
        status: 'ready'
      },
      {
        id: '2',
        trackingNumber: 'BD123457',
        recipient: 'Marie Martin',
        address: '456 Avenue du Commerce, Pointe-Noire',
        weight: 1.8,
        dimensions: '25x18x12 cm',
        declaredValue: 35000,
        service: 'standard',
        status: 'pending'
      }
    ];

    setBulkShipments(mockBulkShipments);
    setPackages(mockPackages);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'express': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simuler le traitement du fichier
      setTimeout(() => {
        setIsUploading(false);
        // Ici on traiterait le fichier Excel/CSV
        console.log('Fichier traité:', file.name);
      }, 2000);
    }
  };

  const BulkOverview = () => (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Envois en cours</p>
                <p className="text-2xl font-bold">{bulkShipments.filter(s => s.status === 'processing').length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total colis</p>
                <p className="text-2xl font-bold">{bulkShipments.reduce((sum, s) => sum + s.totalPackages, 0)}</p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold">
                  {(bulkShipments.reduce((sum, s) => sum + s.totalValue, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients actifs</p>
                <p className="text-2xl font-bold">{new Set(bulkShipments.map(s => s.clientName)).size}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des envois bulk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Envois en lot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{shipment.clientName}</div>
                    <div className="text-sm text-gray-600">ID: {shipment.id}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{shipment.totalPackages} colis</div>
                    <div className="text-sm text-gray-600">{shipment.totalWeight} kg</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status === 'draft' ? 'Brouillon' :
                       shipment.status === 'pending' ? 'En attente' :
                       shipment.status === 'processing' ? 'En cours' :
                       shipment.status === 'shipped' ? 'Expédié' : 'Livré'}
                    </Badge>
                    <Badge className={getPriorityColor(shipment.priority)}>
                      {shipment.priority === 'urgent' ? 'Urgent' :
                       shipment.priority === 'high' ? 'Élevé' :
                       shipment.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BulkCreation = () => (
    <div className="space-y-6">
      {/* Import de fichiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import en lot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Import Excel/CSV</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez votre fichier Excel ou CSV
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir un fichier
                        </>
                      )}
                    </Button>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Template de fichier</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger template Excel
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger template CSV
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Guide d'utilisation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Création manuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Création manuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <Input placeholder="Nom du client" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de colis</label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priorité</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Créer l'envoi en lot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PackageManagement = () => (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des colis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Rechercher par destinataire..." />
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Tous les services</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="premium">Premium</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="ready">Prêt</option>
              <option value="shipped">Expédié</option>
              <option value="delivered">Livré</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des colis */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tracking</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Destinataire</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Adresse</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Poids</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{pkg.trackingNumber}</td>
                    <td className="px-4 py-3 text-sm">{pkg.recipient}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pkg.address}</td>
                    <td className="px-4 py-3 text-sm">{pkg.weight} kg</td>
                    <td className="px-4 py-3">
                      <Badge className={getServiceColor(pkg.service)}>
                        {pkg.service === 'premium' ? 'Premium' :
                         pkg.service === 'express' ? 'Express' : 'Standard'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(pkg.status)}>
                        {pkg.status === 'pending' ? 'En attente' :
                         pkg.status === 'ready' ? 'Prêt' :
                         pkg.status === 'shipped' ? 'Expédié' : 'Livré'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interface Bulk - Professionnels
            </h1>
            <p className="text-gray-600">
              Gestion avancée des envois en lot pour entreprises et professionnels
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="creation">Création en lot</TabsTrigger>
            <TabsTrigger value="management">Gestion des colis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BulkOverview />
          </TabsContent>

          <TabsContent value="creation">
            <BulkCreation />
          </TabsContent>

          <TabsContent value="management">
            <PackageManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ColisBulkInterfacePage; 