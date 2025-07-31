import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Bed, Bath, Car, Ruler } from 'lucide-react';

const RealEstate: React.FC = () => {
  const properties = [
    {
      id: 1,
      title: 'Appartement moderne 3 pièces',
      location: 'Brazzaville Centre',
      price: '45,000,000 FCFA',
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      area: '120m²',
      type: 'Vente'
    },
    {
      id: 2,
      title: 'Maison avec jardin',
      location: 'Pointe-Noire',
      price: '85,000,000 FCFA',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      area: '200m²',
      type: 'Vente'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Immobilier BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez votre bien immobilier idéal avec notre sélection de propriétés de qualité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
                <Badge className="mb-2 bg-orange-500">{property.type}</Badge>
                <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{property.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.bedrooms} chambres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.bathrooms} sdb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.parking} parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{property.area}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-600">{property.price}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealEstate; 