import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Shield, Clock } from 'lucide-react';

const Finance: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Prêt personnel',
      description: 'Financement flexible pour vos projets',
      rate: '12%',
      amount: 'Jusqu\'à 5M FCFA',
      duration: '12-60 mois'
    },
    {
      id: 2,
      title: 'Épargne',
      description: 'Faites fructifier votre argent',
      rate: '8%',
      amount: 'À partir de 50k FCFA',
      duration: 'Flexible'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Finance BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Solutions financières adaptées à vos besoins avec des taux compétitifs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taux:</span>
                    <span className="font-semibold text-emerald-600">{service.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Montant:</span>
                    <span className="font-semibold">{service.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Durée:</span>
                    <span className="font-semibold">{service.duration}</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Demander
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finance; 