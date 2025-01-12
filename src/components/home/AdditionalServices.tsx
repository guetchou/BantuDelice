import { Card } from "@/components/ui/card";
import { ChefHat, House, Bike, ShoppingBag } from "lucide-react";

const AdditionalServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Additionnels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Traiteur Événementiel</h3>
            <p className="text-gray-600">
              Service traiteur spécialisé en cuisine congolaise
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <House className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Services Ménagers</h3>
            <p className="text-gray-600">
              Entretien et nettoyage professionnel
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Bike className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Location de Vélos</h3>
            <p className="text-gray-600">
              Découvrez la ville autrement
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Courses à Domicile</h3>
            <p className="text-gray-600">
              Livraison de vos courses quotidiennes
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;