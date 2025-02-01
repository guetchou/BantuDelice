import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Car, Heart, ShoppingBag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import { supabase } from "@/integrations/supabase/client";
import HeroSection from '@/components/home/HeroSection';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import EssentialServices from '@/components/home/EssentialServices';
import AdditionalServices from '@/components/home/AdditionalServices';
import CulturalServices from '@/components/home/CulturalServices';
import Testimonials from '@/components/home/Testimonials';
import DeliveryMap from '@/components/DeliveryMap';
import AIChat from '@/components/chat/AIChat';
import CartDrawer from '@/components/cart/CartDrawer';

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
        <HeroSection />

        {/* Featured Carousel */}
        <FeaturedCarousel />

        {/* Essential Services */}
        <EssentialServices />

        {/* Additional Services */}
        <AdditionalServices />

        {/* Cultural Services */}
        <CulturalServices />

        {/* Delivery Map */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Notre Zone de Livraison</h2>
            <div className="h-[500px] rounded-lg overflow-hidden shadow-xl">
              <DeliveryMap />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* AI Chat & Cart */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
          <CartDrawer />
          <div className="relative">
            <AIChat />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;