
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Marie K.',
      role: 'Cliente fidèle',
      content: 'Buntudelice a révolutionné ma façon de commander de la nourriture. Rapide, fiable et délicieux !',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Jean P.',
      role: 'Utilisateur régulier',
      content: 'Le service de taxi est excellent. Les chauffeurs sont professionnels et ponctuels.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Sarah M.',
      role: 'Nouvelle cliente',
      content: 'Première commande hier, tout était parfait ! Je recommande vivement.',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Avis de nos clients</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de nos services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-400'}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white/80 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
