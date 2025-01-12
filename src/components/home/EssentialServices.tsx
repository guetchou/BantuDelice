import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Car, Fuel } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EssentialServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos Services Essentiels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Commande de Repas</h3>
            <p className="text-gray-600 mb-6">
              Vos plats congolais préférés livrés chauds et dans les meilleurs délais
            </p>
            <Button 
              onClick={() => navigate('/restaurants')}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Commander
            </Button>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <Car className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Transport VIP</h3>
            <p className="text-gray-600 mb-6">
              Service de transport personnalisé avec chauffeurs professionnels
            </p>
            <Button variant="outline" className="w-full">
              Réserver
            </Button>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <Fuel className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Livraison de Gaz</h3>
            <p className="text-gray-600 mb-6">
              Approvisionnement rapide et sécurisé à votre porte
            </p>
            <Button variant="outline" className="w-full">
              Commander
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EssentialServices;