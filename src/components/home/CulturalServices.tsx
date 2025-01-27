import { Card } from "@/components/ui/card";
import { ChefHat, Utensils, Book, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CulturalServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Culturels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-green-500">Disponible</Badge>
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Cours de Cuisine</h3>
            <p className="text-gray-600 mb-4">
              Apprenez l'art de la cuisine congolaise traditionnelle avec nos chefs experts.
              Ingrédients et matériel fournis.
            </p>
            <div className="text-sm text-gray-500">
              Sessions: Mar-Dim
              <br />
              10h-12h ou 15h-17h
              <br />
              20.000 FCFA/session
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-yellow-500">Sur inscription</Badge>
            <Utensils className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Événements Culinaires</h3>
            <p className="text-gray-600 mb-4">
              Participez à nos festivals gastronomiques mensuels.
              Dégustations, démonstrations et animations culturelles.
            </p>
            <div className="text-sm text-gray-500">
              Dernier samedi du mois
              <br />
              14h-22h
              <br />
              Entrée: 15.000 FCFA
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-green-500">Disponible</Badge>
            <Book className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Bibliothèque Culturelle</h3>
            <p className="text-gray-600 mb-4">
              Accédez à notre collection de livres sur la culture congolaise.
              Plus de 1000 ouvrages disponibles.
            </p>
            <div className="text-sm text-gray-500">
              Lun-Sam: 9h-18h
              <br />
              Abonnement mensuel: 5.000 FCFA
              <br />
              Consultation sur place gratuite
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-blue-500">Hebdomadaire</Badge>
            <Heart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Club Social</h3>
            <p className="text-gray-600 mb-4">
              Rejoignez notre communauté pour des échanges culturels enrichissants.
              Activités et rencontres hebdomadaires.
            </p>
            <div className="text-sm text-gray-500">
              Réunions: Chaque samedi
              <br />
              16h-19h
              <br />
              Adhésion annuelle: 25.000 FCFA
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CulturalServices;