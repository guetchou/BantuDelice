import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  FileText, 
  Search, 
  Filter,
  Globe,
  Package,
  Zap,
  Flame,
  Droplets,
  Battery,
  Smartphone,
  Camera,
  Wine,
  Pill,
  CheckCircle,
  X,
  Info
} from 'lucide-react';

interface RestrictionItem {
  id: string;
  name: string;
  category: 'prohibited' | 'restricted' | 'conditional' | 'allowed';
  description: string;
  reason: string;
  penalty?: string;
  alternatives?: string[];
  icon: React.ComponentType<unknown>;
  examples: string[];
}

interface CustomsRegulation {
  country: string;
  restrictions: RestrictionItem[];
  specialRequirements: string[];
  documents: string[];
  contact: string;
}

const ColisRestrictionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prohibited' | 'restricted' | 'conditional' | 'allowed'>('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const restrictionItems: RestrictionItem[] = [
    {
      id: '1',
      name: 'Produits inflammables',
      category: 'prohibited',
      description: 'Produits contenant des substances inflammables ou explosives',
      reason: 'Risque de sécurité pendant le transport',
      penalty: 'Confiscation et amende de 50 000 FCFA',
      icon: Flame,
      examples: ['Essence', 'Briquets', 'Bombes aérosol', 'Peintures inflammables']
    },
    {
      id: '2',
      name: 'Liquides corrosifs',
      category: 'prohibited',
      description: 'Substances corrosives qui peuvent endommager les autres colis',
      reason: 'Risque de dommages aux autres envois',
      penalty: 'Confiscation et amende de 75 000 FCFA',
      icon: Droplets,
      examples: ['Acides', 'Bases fortes', 'Produits de nettoyage concentrés']
    },
    {
      id: '3',
      name: 'Batteries au lithium',
      category: 'restricted',
      description: 'Batteries lithium-ion et lithium-métal',
      reason: 'Risque d\'incendie en cas de court-circuit',
      alternatives: ['Batteries nickel-cadmium', 'Batteries alcalines'],
      icon: Battery,
      examples: ['Téléphones portables', 'Ordinateurs portables', 'Power banks']
    },
    {
      id: '4',
      name: 'Alcool et boissons',
      category: 'conditional',
      description: 'Boissons alcoolisées et spiritueux',
      reason: 'Réglementation douanière et fiscale',
      alternatives: ['Boissons non alcoolisées', 'Jus de fruits'],
      icon: Wine,
      examples: ['Vins', 'Bière', 'Whisky', 'Rhum']
    },
    {
      id: '5',
      name: 'Médicaments',
      category: 'restricted',
      description: 'Médicaments et produits pharmaceutiques',
      reason: 'Contrôle sanitaire et réglementation médicale',
      alternatives: ['Médicaments en vente libre', 'Compléments alimentaires'],
      icon: Pill,
      examples: ['Antibiotiques', 'Antidouleurs', 'Vitamines']
    },
    {
      id: '6',
      name: 'Armes et objets tranchants',
      category: 'prohibited',
      description: 'Armes, couteaux et objets pouvant être utilisés comme armes',
      reason: 'Sécurité publique et réglementation',
      penalty: 'Confiscation et poursuites judiciaires',
      icon: X, // Changed from Knife to X
      examples: ['Couteaux', 'Ciseaux', 'Outils tranchants', 'Armes blanches']
    },
    {
      id: '7',
      name: 'Produits électroniques',
      category: 'allowed',
      description: 'Appareils électroniques et gadgets',
      reason: 'Autorisé avec certaines restrictions',
      icon: Smartphone,
      examples: ['Téléphones', 'Tablettes', 'Ordinateurs', 'Accessoires']
    },
    {
      id: '8',
      name: 'Produits alimentaires',
      category: 'conditional',
      description: 'Produits alimentaires et denrées périssables',
      reason: 'Contrôle sanitaire et conservation',
      alternatives: ['Produits secs', 'Conserves', 'Produits lyophilisés'],
      icon: Package,
      examples: ['Fruits frais', 'Viandes', 'Produits laitiers', 'Chocolats']
    }
  ];

  const customsRegulations: CustomsRegulation[] = [
    {
      country: 'Congo',
      restrictions: restrictionItems.filter(item => ['prohibited', 'restricted'].includes(item.category)),
      specialRequirements: [
        'Certificat phytosanitaire pour les produits végétaux',
        'Autorisation spéciale pour les médicaments',
        'Déclaration de valeur pour les objets de valeur'
      ],
      documents: [
        'Facture commerciale',
        'Certificat d\'origine',
        'Liste de colisage',
        'Autorisation d\'importation (si applicable)'
      ],
      contact: 'Douanes du Congo - +242 06 123 45 67'
    },
    {
      country: 'France',
      restrictions: restrictionItems.filter(item => item.category === 'prohibited'),
      specialRequirements: [
        'Certificat de conformité CE',
        'Déclaration douanière complète',
        'Paiement des droits de douane'
      ],
      documents: [
        'Facture commerciale',
        'Certificat d\'origine',
        'Certificat de conformité',
        'Déclaration en douane'
      ],
      contact: 'Douanes françaises - +33 1 72 40 78 50'
    },
    {
      country: 'États-Unis',
      restrictions: restrictionItems.filter(item => ['prohibited', 'restricted'].includes(item.category)),
      specialRequirements: [
        'FDA approval pour les produits alimentaires',
        'Certification FCC pour les appareils électroniques',
                'Déclaration de contenu détaillée'
      ],
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Certificate of Origin',
        'Customs Declaration'
      ],
      contact: 'US Customs - +1 877 227 5511'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prohibited': return 'bg-red-100 text-red-800';
      case 'restricted': return 'bg-orange-100 text-orange-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      case 'allowed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prohibited': return <X className="h-4 w-4" />;
      case 'restricted': return <AlertTriangle className="h-4 w-4" />;
      case 'conditional': return <Info className="h-4 w-4" />;
      case 'allowed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredItems = restrictionItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ProhibitedItemsTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Toutes les catégories</option>
            <option value="prohibited">Interdits</option>
            <option value="restricted">Restreints</option>
            <option value="conditional">Conditionnels</option>
            <option value="allowed">Autorisés</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-orange-600" />
                {item.name}
                <Badge className={getCategoryColor(item.category)}>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(item.category)}
                    {item.category === 'prohibited' ? 'Interdit' :
                     item.category === 'restricted' ? 'Restreint' :
                     item.category === 'conditional' ? 'Conditionnel' : 'Autorisé'}
                  </div>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{item.description}</p>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-sm">Raison :</span>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                </div>
                
                {item.penalty && (
                  <div>
                    <span className="font-medium text-sm text-red-600">Sanction :</span>
                    <p className="text-sm text-red-600">{item.penalty}</p>
                  </div>
                )}
                
                {item.alternatives && (
                  <div>
                    <span className="font-medium text-sm text-green-600">Alternatives :</span>
                    <ul className="text-sm text-green-600">
                      {item.alternatives.map((alt, index) => (
                        <li key={index}>• {alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-sm">Exemples :</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.examples.map((example, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CustomsRegulationsTab = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Tous les pays</option>
          {customsRegulations.map((reg) => (
            <option key={reg.country} value={reg.country}>{reg.country}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {customsRegulations
          .filter(reg => selectedCountry === 'all' || reg.country === selectedCountry)
          .map((regulation) => (
            <Card key={regulation.country}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Réglementation douanière - {regulation.country}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Exigences spéciales</h4>
                    <ul className="space-y-2">
                      {regulation.specialRequirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Documents requis</h4>
                    <ul className="space-y-2">
                      {regulation.documents.map((doc, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Contact douanes :</span>
                    <span>{regulation.contact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const SafetyGuidelinesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Guide de sécurité pour l'emballage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Règles générales</h4>
              <ul className="space-y-2 text-sm">
                <li>• Utilisez des matériaux d'emballage appropriés</li>
                <li>• Protégez les objets fragiles avec du papier bulle</li>
                <li>• Fermez solidement tous les colis</li>
                <li>• Indiquez clairement le contenu sur l'étiquette</li>
                <li>• Respectez les limites de poids et de taille</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Interdictions absolues</h4>
              <ul className="space-y-2 text-sm text-red-600">
                <li>• Produits explosifs ou inflammables</li>
                <li>• Substances toxiques ou corrosives</li>
                <li>• Armes et munitions</li>
                <li>• Produits contrefaits</li>
                <li>• Matériel pornographique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conseils d'emballage par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">Électronique</h5>
              <ul className="text-sm space-y-1">
                <li>• Emballage anti-choc</li>
                <li>• Protection contre l'humidité</li>
                <li>• Batteries séparées</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">Vêtements</h5>
              <ul className="text-sm space-y-1">
                <li>• Protection contre l'humidité</li>
                <li>• Sacs hermétiques</li>
                <li>• Éviter les plis</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-2">Documents</h5>
              <ul className="text-sm space-y-1">
                <li>• Enveloppes renforcées</li>
                <li>• Protection contre l'eau</li>
                <li>• Éviter les plis</li>
              </ul>
            </div>
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
              Restrictions & Réglementations
            </h1>
            <p className="text-gray-600">
              Guide complet des articles interdits, restreints et des réglementations douanières
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prohibited">Articles Interdits</TabsTrigger>
            <TabsTrigger value="customs">Réglementations Douanières</TabsTrigger>
            <TabsTrigger value="safety">Guide de Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="prohibited">
            <ProhibitedItemsTab />
          </TabsContent>

          <TabsContent value="customs">
            <CustomsRegulationsTab />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyGuidelinesTab />
          </TabsContent>
        </Tabs>

        {/* Avertissement important */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Avertissement Important</h3>
                <p className="text-red-700 text-sm">
                  Le non-respect des restrictions peut entraîner la confiscation de votre colis, 
                  des amendes et des poursuites judiciaires. En cas de doute, contactez notre 
                  service client avant l'envoi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisRestrictionsPage; 