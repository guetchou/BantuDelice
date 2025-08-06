import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Music, 
  Film, 
  Gamepad2, 
  Calendar,
  MapPin,
  Star,
  Users
} from 'lucide-react';

const Entertainment: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Festival de Musique Africaine',
      date: '2024-02-15',
      time: '19:00',
      location: 'Stade Alphonse Massamba-Débat',
      price: '15,000 FCFA',
      category: 'Musique',
      image: '/events/music.jpg'
    },
    {
      id: 2,
      title: 'Cinéma en Plein Air',
      date: '2024-02-20',
      time: '20:30',
      location: 'Place de la Révolution',
      price: '5,000 FCFA',
      category: 'Cinéma',
      image: '/events/cinema.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Divertissement BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs événements, spectacles et activités de divertissement au Congo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {events.map((event) => (
            <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <Badge variant="outline" className="mb-2">{event.category}</Badge>
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date} à {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-indigo-600">{event.price}</span>
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                    Réserver
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

export default Entertainment; 