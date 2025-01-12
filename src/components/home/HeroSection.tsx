import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[500px] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Découvrez la Cuisine Congolaise !
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Des plats authentiques et savoureux livrés directement chez vous.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => navigate('/restaurants')}
            >
              Commander Maintenant
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Découvrir nos Spécialités
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;