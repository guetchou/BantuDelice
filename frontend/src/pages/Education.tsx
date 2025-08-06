import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Users, Clock, Star } from 'lucide-react';

const Education: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Formation en développement web',
      instructor: 'Prof. David Kimbembe',
      duration: '3 mois',
      students: 45,
      rating: 4.7,
      price: '150,000 FCFA'
    },
    {
      id: 2,
      title: 'Cours de français avancé',
      instructor: 'Prof. Marie Nzamba',
      duration: '2 mois',
      students: 32,
      rating: 4.8,
      price: '80,000 FCFA'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Éducation BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Développez vos compétences avec nos formations de qualité et nos experts pédagogiques.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.duration}</span>
                  <Users className="h-4 w-4 text-gray-400 ml-2" />
                  <span className="text-sm text-gray-600">{course.students} étudiants</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">{course.price}</span>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    S'inscrire
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

export default Education; 