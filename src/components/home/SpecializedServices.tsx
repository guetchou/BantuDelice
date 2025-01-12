import { Card } from "@/components/ui/card";
import { Building, Stethoscope, GraduationCap } from "lucide-react";

const SpecializedServices = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Spécialisés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Building className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Location Immobilière</h3>
            <p className="text-gray-600">
              Trouvez votre logement idéal
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Assistance Médicale</h3>
            <p className="text-gray-600">
              Consultation et soins à domicile
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Soutien Scolaire</h3>
            <p className="text-gray-600">
              Cours particuliers et aide aux devoirs
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SpecializedServices;