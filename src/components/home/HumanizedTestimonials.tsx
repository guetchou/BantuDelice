import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marie Nkounkou",
    role: "Chef d'entreprise",
    company: "Restaurant Le Savoureux",
    content: "BantuDelice a révolutionné notre service de livraison. Nos clients sont ravis de la rapidité et de la qualité du service. C'est un vrai partenaire de confiance !",
    rating: 5,
    image: "/images/avatar/bertille.png"
  },
  {
    id: 2,
    name: "Jean-Pierre Mboungou",
    role: "Entrepreneur",
    company: "Tech Solutions Congo",
    content: "Grâce à BantuDelice, j'économise du temps et de l'argent sur mes livraisons. L'application est intuitive et le service client est exceptionnel.",
    rating: 5,
    image: "/images/avatar/david.png"
  },
  {
    id: 3,
    name: "Sarah Makaya",
    role: "Étudiante",
    company: "Université Marien Ngouabi",
    content: "Parfait pour mes commandes de repas entre les cours ! Rapide, fiable et les livreurs sont toujours souriants. Je recommande vivement !",
    rating: 5,
    image: "images/avatar/nadine.png"
  }
];

const HumanizedTestimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Arrière-plan avec image */}
      <div className="absolute inset-0">
        <img 
          src="/images/thedrop24BG.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      {/* Illustration de groupe en fond */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/illustrations/happy-customer.jpg" 
          alt="Clients heureux BantuDelice" 
          className="w-full h-full object-cover object-bottom opacity-15"
          loading="lazy"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui font confiance à BantuDelice
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="backdrop-blur-md bg-white/80 hover:bg-white/90 transition-all duration-300 border-0 shadow-xl group">
              <CardContent className="p-8">
                {/* Note avec étoiles */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Citation */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-orange-400 mb-3" />
                  <p className="text-gray-700 text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Profil client */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-orange-200 group-hover:border-orange-400 transition-colors duration-300">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback vers les initiales si l'image ne charge pas
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-orange-600 font-medium">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA avec effet glass */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-8 py-4 shadow-lg">
            <span className="text-gray-700 font-medium">
              Rejoignez plus de 10,000 clients satisfaits
            </span>
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300">
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanizedTestimonials; 