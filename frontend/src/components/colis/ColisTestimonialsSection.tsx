import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  city: string;
  rating: number;
  comment: string;
  image: string;
  avatar: string;
}

const ColisTestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Mboungou",
      city: "Brazzaville",
      rating: 5,
      comment: "Service exceptionnel ! Mon colis est arrivé en parfait état et avant l'heure prévue. Je recommande vivement.",
      image: "/images/client-satisfait.png",
      avatar: "/images/avatar/bertille.png"
    },
    {
      name: "Marc Nkounkou",
      city: "Pointe-Noire",
      rating: 5,
      comment: "Le suivi en temps réel est génial. J'ai pu voir exactement où était mon colis à chaque étape.",
      image: "/images/nos-services.jpg",
      avatar: "/images/avatar/david.png"
    },
    {
      name: "Julie Mampouya",
      city: "Dolisie",
      rating: 5,
      comment: "Équipe très professionnelle et tarifs transparents. Je n'utilise plus que ce service pour mes envois.",
      image: "/images/team-celebrating.jpg",
      avatar: "/images/avatar/nadine.png"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ce que disent <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">nos clients</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={testimonial.image} 
                  alt="Témoignage client"
                  className="w-full h-48 object-cover rounded-t-lg"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg"></div>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="text-sm text-gray-500">{testimonial.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColisTestimonialsSection; 