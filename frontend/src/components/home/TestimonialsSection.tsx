
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 'test1',
      name: 'Marie K.',
      avatar: 'public/images/avatar1.jpeg',
      role: 'Cliente régulière',
      content: 'Je commande régulièrement sur Buntudelice et je suis toujours satisfaite. La livraison est rapide et les plats sont délicieux. La nouvelle fonctionnalité de suivi en temps réel est vraiment pratique!',
      rating: 5,
      service: 'Restaurant'
    },
    {
      id: 'test2',
      name: 'Thomas L.',
      avatar: 'public/images/avatar2.jpeg',
      role: 'Entrepreneur',
      content: 'Le service de taxi est impeccable. Chauffeurs ponctuels et professionnels. L\'application est intuitive et les prix sont transparents. Je recommande vivement!',
      rating: 5,
      service: 'Taxi'
    },
    {
      id: 'test3',
      name: 'Sophie M.',
      avatar: 'public/images/avatar3.jpeg',
      role: 'Étudiante',
      content: 'Grâce au covoiturage, je fais des économies considérables sur mes trajets vers l\'université. J\'ai également rencontré des personnes formidables. Service top!',
      rating: 4,
      service: 'Covoiturage'
    },
    {
      id: 'test4',
      name: 'Jean-Paul N.',
      avatar: 'https://i.pravatar.cc/150?img=60',
      role: 'Chef cuisinier',
      content: 'En tant que restaurateur partenaire, je suis impressionné par la qualité du service et l\'augmentation des commandes depuis que j\'ai rejoint la plateforme. L\'équipe support est très réactive.',
      rating: 5,
      service: 'Partenaire'
    }
  ];

  const serviceColors = {
    'Restaurant': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Taxi': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Covoiturage': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Partenaire': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] bg-repeat opacity-5"></div>
      
      <motion.div
        className="absolute top-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[100px]"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[100px]"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Quote className="h-8 w-8 text-purple-400 rotate-180" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Ce que nos clients disent</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Des milliers d'utilisateurs satisfaits de nos services à travers Brazzaville. Voici quelques témoignages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 rounded-xl p-6 flex flex-col h-full transition-all duration-300"
            >
              <div className="mb-4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${serviceColors[testimonial.service as keyof typeof serviceColors]}`}>
                  {testimonial.service}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`inline-block h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} mr-1`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-300 mb-6 relative italic">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-purple-500/20 rotate-180" />
                  {testimonial.content}
                  <Quote className="absolute -bottom-2 -right-2 h-6 w-6 text-purple-500/20" />
                </blockquote>
              </div>
              
              <div className="flex items-center mt-4">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full mr-3 bg-purple-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-wrap justify-center gap-2 mb-6">
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-white font-medium text-sm">
              Service exceptionnel
            </div>
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-white font-medium text-sm">
              Livraison rapide
            </div>
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-white font-medium text-sm">
              Chauffeurs professionnels
            </div>
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-white font-medium text-sm">
              Économique
            </div>
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-white font-medium text-sm">
              Application intuitive
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${60 + i}`} 
                  alt={`User ${i}`}
                  className="w-8 h-8 rounded-full border-2 border-gray-900"
                />
              ))}
            </div>
            <div className="pl-4 text-white">
              <span className="font-bold">4.8/5</span>
              <span className="text-gray-400 ml-1">de 2,348 avis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
