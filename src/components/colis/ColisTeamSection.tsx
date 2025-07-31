import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const ColisTeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Jean Kimbou",
      role: "Directeur des Opérations",
      image: "/images/avatar/david.png",
      quote: "Notre mission est de connecter le Congo, un colis à la fois."
    },
    {
      name: "Marie Nkounkou",
      role: "Responsable Qualité",
      image: "/images/avatar/bertille.png",
      quote: "La satisfaction client est notre priorité absolue."
    },
    {
      name: "Pierre Mbou",
      role: "Chef d'Équipe",
      image: "/images/avatar/nadine.png",
      quote: "Chaque colis est traité avec le plus grand soin."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">Équipe</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Des professionnels dédiés à votre satisfaction
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg"></div>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 italic">"{member.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColisTeamSection; 