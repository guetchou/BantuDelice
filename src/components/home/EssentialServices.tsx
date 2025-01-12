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
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Commande de Repas</h3>
            <p className="text-gray-600 mb-4">
              Vos plats congolais préférés livrés chauds
            </p>
            <Button onClick={() => navigate('/restaurants')}>Commander</Button>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Car className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Transport VIP</h3>
            <p className="text-gray-600 mb-4">
              Service de transport personnalisé
            </p>
            <Button variant="outline">Réserver</Button>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Fuel className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="text-xl font-semibold mb-2">Livraison de Gaz</h3>
            <p className="text-gray-600 mb-4">
              Approvisionnement rapide et sécurisé
            </p>
            <Button variant="outline">Commander</Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EssentialServices;