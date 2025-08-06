import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Stethoscope, 
  Pill, 
  Calendar,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

const Health: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Consultation médicale',
      doctor: 'Dr. Marie Nzamba',
      specialty: 'Médecine générale',
      rating: 4.8,
      price: '25,000 FCFA',
      available: true
    },
    {
      id: 2,
      title: 'Consultation dentaire',
      doctor: 'Dr. Jean Mbeki',
      specialty: 'Dentisterie',
      rating: 4.6,
      price: '35,000 FCFA',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Santé BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prenez soin de votre santé avec nos services médicaux de qualité et nos professionnels expérimentés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{service.doctor}</p>
                <Badge variant="outline" className="mb-3">{service.specialty}</Badge>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">{service.price}</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    Prendre RDV
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

export default Health; 