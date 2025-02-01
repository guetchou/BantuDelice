import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Car, Heart, ShoppingBag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Auth session:", session);
    };
    checkAuth();
  }, []);

  const handleFavorite = async (menuItemId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .upsert([
          {
            user_id: session.user.id,
            menu_item_id: menuItemId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Restaurant ajouté aux favoris",
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le restaurant aux favoris",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                Découvrez les meilleurs restaurants africains
              </h1>
              <p className="text-xl mb-8 animate-fade-in delay-100">
                Commandez vos plats préférés ou réservez un taxi en quelques clics
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6 flex items-center gap-2"
                  onClick={() => navigate('/restaurants')}
                >
                  <ShoppingBag className="w-6 h-6" />
                  Commander maintenant
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 flex items-center gap-2"
                  onClick={() => navigate('/taxi/booking')}
                >
                  <Car className="w-6 h-6" />
                  Réserver un taxi
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Restaurants */}
            <div className="col-span-full">
              <h2 className="text-3xl font-bold mb-8">Restaurants populaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((restaurant) => (
                  <div key={restaurant} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={`/images/restaurant-${restaurant}.jpg`}
                        alt={`Restaurant ${restaurant}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleFavorite(`menu-item-${restaurant}`)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      >
                        <Heart className="w-6 h-6 text-red-500" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Restaurant {restaurant}</h3>
                      <p className="text-gray-600 mb-4">Cuisine africaine authentique</p>
                      <Button
                        onClick={() => navigate(`/restaurant/${restaurant}`)}
                        className="w-full"
                      >
                        Voir le menu
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="col-span-full mt-12">
              <h2 className="text-3xl font-bold mb-8">Catégories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Africain', 'Asiatique', 'Européen', 'Américain'].map((category) => (
                  <div
                    key={category}
                    className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                  >
                    <h3 className="text-lg font-semibold">{category}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="col-span-full mt-12 bg-gray-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Comment ça marche</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Choisissez</h3>
                  <p className="text-gray-600">Parcourez nos restaurants partenaires</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Commandez</h3>
                  <p className="text-gray-600">Sélectionnez vos plats préférés</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Profitez</h3>
                  <p className="text-gray-600">Recevez votre commande rapidement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;