import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[600px] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Découvrez la Cuisine<br />
            Congolaise Authentique
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fade-in delay-100">
            Des plats traditionnels préparés avec passion et livrés directement chez vous.
            Explorez une expérience culinaire unique.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in delay-200">
            <Button 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8"
              onClick={() => navigate('/restaurants')}
            >
              Commander Maintenant
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 font-semibold px-8"
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