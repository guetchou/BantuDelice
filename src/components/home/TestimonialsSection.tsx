
import React from "react";

const testimonials = [
  {
    name: "Marie K.",
    location: "Brazzaville",
    text: "Grâce à BantuDelice, j'ai pu envoyer un colis au village en 24h.",
    rating: 5,
    service: "Livraison"
  },
  {
    name: "Jean P.",
    location: "Pointe-Noire",
    text: "Je réserve mes trajets Brazzaville–Pointe-Noire en 2 clics.",
    rating: 5,
    service: "Transport"
  },
  {
    name: "Sophie M.",
    location: "Brazzaville",
    text: "Livraison de repas rapide et fiable, je recommande !",
    rating: 5,
    service: "Restauration"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-16" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        Ce que disent nos clients
      </h2>
      <p className="text-lg text-white/80 text-center mb-12 max-w-2xl mx-auto">
        Découvrez les témoignages de nos utilisateurs satisfaits
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6" role="listitem">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4" aria-hidden="true">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <p className="text-white/60 text-sm">{testimonial.location}</p>
              </div>
            </div>
            <blockquote className="text-white/90 mb-4 italic">"{testimonial.text}"</blockquote>
            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400" aria-label={`${testimonial.rating} étoiles`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} aria-hidden="true">⭐</span>
                ))}
              </div>
              <span className="text-white/60 text-sm">{testimonial.service}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
