import { Card } from "@/components/ui/card";
import { ChefHat, Utensils, Book, Heart } from "lucide-react";

const CulturalServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Culturels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Cours de Cuisine</h3>
            <p className="text-gray-600">
              Apprenez la cuisine congolaise
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Utensils className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Événements Culinaires</h3>
            <p className="text-gray-600">
              Dégustations et festivals
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Book className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Bibliothèque Culturelle</h3>
            <p className="text-gray-600">
              Livres et ressources sur la culture congolaise
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Club Social</h3>
            <p className="text-gray-600">
              Rencontres et échanges culturels
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CulturalServices;