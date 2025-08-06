import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Package, 
  Globe, 
  Search,
  Info,
  X,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Camera
} from 'lucide-react';

interface RestrictedItem {
  id: string;
  name: string;
  category: string;
  status: 'forbidden' | 'restricted' | 'regulated';
  description: string;
  penalty?: string;
  alternative?: string;
  image?: string;
}

interface CustomsRegulation {
  id: string;
  country: string;
  category: string;
  description: string;
  requirements: string[];
  documents: string[];
  fees?: number;
}

const RestrictionsGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const restrictedItems: RestrictedItem[] = [
    {
      id: '1',
      name: 'Armes à feu et munitions',
      category: 'Sécurité',
      status: 'forbidden',
      description: 'Toutes les armes à feu, munitions et accessoires sont strictement interdits',
      penalty: 'Confiscation et poursuites judiciaires',
      image: '🔫'
    },
    {
      id: '2',
      name: 'Drogues et substances illicites',
      category: 'Santé',
      status: 'forbidden',
      description: 'Toutes les drogues, médicaments sans ordonnance et substances contrôlées',
      penalty: 'Confiscation et arrestation',
      image: '💊'
    },
    {
      id: '3',
      name: 'Produits alimentaires périssables',
      category: 'Alimentation',
      status: 'restricted',
      description: 'Viandes, poissons, produits laitiers non transformés',
      alternative: 'Produits secs, conserves, aliments transformés',
      image: '🥩'
    },
    {
      id: '4',
      name: 'Plantes et graines',
      category: 'Agriculture',
      status: 'restricted',
      description: 'Plantes vivantes, graines non certifiées',
      alternative: 'Plantes séchées, graines certifiées avec permis',
      image: '🌱'
    },
    {
      id: '5',
      name: 'Électronique et batteries',
      category: 'Technologie',
      status: 'regulated',
      description: 'Batteries au lithium, appareils électroniques',
      requirements: 'Déclaration obligatoire, emballage spécial',
      image: '🔋'
    },
    {
      id: '6',
      name: 'Liquides inflammables',
      category: 'Chimie',
      status: 'forbidden',
      description: 'Essence, alcool, solvants, parfums en grande quantité',
      penalty: 'Confiscation immédiate',
      image: '⛽'
    },
    {
      id: '7',
      name: 'Monnaie et bijoux',
      category: 'Valeurs',
      status: 'regulated',
      description: 'Espèces > 1M FCFA, bijoux précieux',
      requirements: 'Déclaration douanière obligatoire',
      image: '💎'
    },
    {
      id: '8',
      name: 'Produits cosmétiques',
      category: 'Beauté',
      status: 'restricted',
      description: 'Certains produits de beauté contenant des substances réglementées',
      alternative: 'Produits certifiés, avec facture d\'achat',
      image: '💄'
    }
  ];

  const customsRegulations: CustomsRegulation[] = [
    {
      id: '1',
      country: 'Congo',
      category: 'Importation',
      description: 'Réglementations douanières pour l\'importation au Congo',
      requirements: [
        'Déclaration en douane obligatoire',
        'Facture commerciale',
        'Certificat d\'origine',
        'Permis d\'importation (si applicable)'
      ],
      documents: [
        'Passeport ou CNI',
        'Facture d\'achat',
        'Liste détaillée du contenu',
        'Certificat de valeur'
      ],
      fees: 5000
    },
    {
      id: '2',
      country: 'France',
      category: 'Exportation',
      description: 'Réglementations pour l\'exportation depuis la France',
      requirements: [
        'Déclaration d\'exportation',
        'Certificat de conformité',
        'Autorisation spéciale (si applicable)'
      ],
      documents: [
        'Passeport',
        'Justificatif d\'achat',
        'Certificat de non-résidence',
        'Formulaire douanier'
      ]
    },
    {
      id: '3',
      country: 'États-Unis',
      category: 'Exportation',
      description: 'Réglementations pour l\'exportation depuis les USA',
      requirements: [
        'Export License (si nécessaire)',
        'Commercial Invoice',
        'Packing List',
        'Certificate of Origin'
      ],
      documents: [
        'Passport',
        'Purchase Receipt',
        'Export Declaration',
        'Customs Form'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: Package },
    { id: 'Sécurité', name: 'Sécurité', icon: Shield },
    { id: 'Santé', name: 'Santé', icon: Info },
    { id: 'Alimentation', name: 'Alimentation', icon: Package },
    { id: 'Agriculture', name: 'Agriculture', icon: Package },
    { id: 'Technologie', name: 'Technologie', icon: Package },
    { id: 'Chimie', name: 'Chimie', icon: Package },
    { id: 'Valeurs', name: 'Valeurs', icon: DollarSign },
    { id: 'Beauté', name: 'Beauté', icon: Package }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forbidden': return 'bg-red-100 text-red-800';
      case 'restricted': return 'bg-yellow-100 text-yellow-800';
      case 'regulated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'forbidden': return <X className="h-4 w-4" />;
      case 'restricted': return <AlertTriangle className="h-4 w-4" />;
      case 'regulated': return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredItems = restrictedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Guide des Restrictions
        </h2>
        <p className="text-gray-600">
          Articles interdits, réglementations douanières et conseils d'expédition
        </p>
      </div>

      <Tabs defaultValue="restrictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="restrictions">Articles Interdits</TabsTrigger>
          <TabsTrigger value="regulations">Réglementations</TabsTrigger>
          <TabsTrigger value="advice">Conseils</TabsTrigger>
        </TabsList>

        {/* Articles Interdits */}
        <TabsContent value="restrictions" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des articles */}
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status === 'forbidden' ? 'Interdit' : 
                             item.status === 'restricted' ? 'Restreint' : 'Réglementé'}
                          </div>
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="space-y-2">
                        {item.penalty && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Sanction: {item.penalty}</span>
                          </div>
                        )}
                        
                        {item.alternative && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Alternative: {item.alternative}</span>
                          </div>
                        )}
                        
                        {item.requirements && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Info className="h-4 w-4" />
                            <span className="text-sm">Exigences: {item.requirements}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Réglementations Douanières */}
        <TabsContent value="regulations" className="space-y-6">
          <div className="grid gap-6">
            {customsRegulations.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {regulation.country} - {regulation.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{regulation.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Exigences
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {regulation.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Documents requis
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {regulation.documents.map((doc, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {regulation.fees && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-blue-700">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Frais de douane: {regulation.fees.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Conseils */}
        <TabsContent value="advice" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Conseils de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Vérifiez toujours la liste des articles interdits avant l'expédition</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Conservez les factures d'achat pour les articles de valeur</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Emballage sécurisé pour les articles fragiles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Déclaration honnête du contenu et de la valeur</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Délais et Procédures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Prévoyez 2-3 jours supplémentaires pour le dédouanement</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Documents à préparer à l'avance</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Contactez-nous en cas de doute sur un article</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">Suivi en temps réel de votre colis</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Coûts et Taxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span className="text-sm">Taxes douanières selon la valeur déclarée</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span className="text-sm">Frais de dédouanement inclus dans nos tarifs</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span className="text-sm">Assurance recommandée pour les articles de valeur</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span className="text-sm">Pas de frais cachés, tarification transparente</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Emballage Recommandé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Cartons doubles pour les articles fragiles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Mousse de protection pour l'électronique</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Scellage hermétique pour les liquides</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Étiquettes claires et lisibles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestrictionsGuide; 