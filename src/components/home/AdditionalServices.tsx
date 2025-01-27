import { Card } from "@/components/ui/card";
import { ChefHat, House, Bike, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdditionalServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Services Additionnels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-green-500">Disponible</Badge>
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Traiteur Événementiel</h3>
            <p className="text-gray-600 mb-4">
              Service traiteur spécialisé en cuisine congolaise pour vos événements. 
              Buffets, cocktails et services sur mesure.
            </p>
            <div className="text-sm text-gray-500">
              À partir de 25.000 FCFA/personne
              <br />
              Disponible 7j/7 sur réservation
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-green-500">Disponible</Badge>
            <House className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Services Ménagers</h3>
            <p className="text-gray-600 mb-4">
              Entretien et nettoyage professionnel de votre domicile. 
              Personnel qualifié et produits écologiques.
            </p>
            <div className="text-sm text-gray-500">
              À partir de 15.000 FCFA/session
              <br />
              Lun-Sam: 8h-18h
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-yellow-500">Sur demande</Badge>
            <Bike className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Location de Vélos</h3>
            <p className="text-gray-600 mb-4">
              Découvrez la ville autrement avec nos vélos de qualité.
              Casques et équipements de sécurité inclus.
            </p>
            <div className="text-sm text-gray-500">
              5.000 FCFA/jour
              <br />
              Réservation 24h à l'avance
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-green-500">Disponible</Badge>
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Courses à Domicile</h3>
            <p className="text-gray-600 mb-4">
              Livraison de vos courses quotidiennes en moins de 2 heures.
              Service personnalisé selon vos besoins.
            </p>
            <div className="text-sm text-gray-500">
              Frais de service: 2.000 FCFA
              <br />
              7j/7: 9h-21h
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;