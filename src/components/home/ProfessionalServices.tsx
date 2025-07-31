import { Card } from "@/components/ui/card";
import { Briefcase, Heart, Book, Package } from "lucide-react";

const ProfessionalServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Professionnels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Services Juridiques</h3>
            <p className="text-gray-600">
              Conseil et assistance juridique
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Aide aux Personnes</h3>
            <p className="text-gray-600">
              Services d'assistance personnalisée
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Book className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Formation Continue</h3>
            <p className="text-gray-600">
              Développement professionnel
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Déménagement</h3>
            <p className="text-gray-600">
              Service complet de déménagement
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalServices;