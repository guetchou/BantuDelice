import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Phone } from "lucide-react";

const FeaturedRestaurant = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Restaurant à la Une
        </h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-full">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop"
                alt="Restaurant" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Le Petit Congo</h3>
              <p className="text-gray-600 mb-6">
                Découvrez notre restaurant emblématique au cœur de la ville, 
                où tradition et modernité se rencontrent pour créer une expérience 
                culinaire unique. Nos chefs passionnés préparent chaque plat avec 
                des ingrédients frais et locaux, perpétuant l'héritage de la cuisine 
                congolaise tout en y apportant une touche contemporaine.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-500" />
                  <span>Ouvert de 11h à 23h, tous les jours</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-orange-500" />
                  <span>123 Avenue de la République, Brazzaville</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-500" />
                  <span>+242 06 123 4567</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/reservation')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Réserver une table
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/menu')}
                >
                  Voir le menu
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedRestaurant;