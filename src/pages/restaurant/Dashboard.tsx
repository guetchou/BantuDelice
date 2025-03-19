
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Store, 
  ShoppingBag, 
  Star, 
  Clock, 
  ChefHat, 
  TrendingUp, 
  Crown,
  BarChart4,
  Settings
} from "lucide-react";
import { PremiumBadge } from "@/components/subscription/PremiumBadge";
import { SubscriptionPlan, SubscriptionTier } from "@/types/subscription";

interface RestaurantStats {
  totalOrders: number;
  averageRating: number;
  pendingOrders: number;
  preparingOrders: number;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{tier: SubscriptionTier, plan: SubscriptionPlan | null}>({
    tier: 'standard',
    plan: null
  });

  useEffect(() => {
    const loadRestaurantStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Get restaurant ID
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!restaurant) {
          toast.error("Restaurant non trouvé");
          return;
        }

        // Get orders stats
        const { data: orders } = await supabase
          .from("orders")
          .select("status, rating")
          .eq("restaurant_id", restaurant.id);

        if (!orders) return;

        const stats = {
          totalOrders: orders.length,
          averageRating: orders.reduce((acc, order) => acc + (order.rating || 0), 0) / orders.length || 0,
          pendingOrders: orders.filter(o => o.status === "pending").length,
          preparingOrders: orders.filter(o => o.status === "preparing").length,
        };

        setStats(stats);
        
        // Check subscription status - using dummy data for now
        // In production:
        // const { data: subscriptionData } = await supabase
        //   .from('partner_subscriptions')
        //   .select('*, plan:subscription_plans(*)')
        //   .eq('partner_id', restaurant.id)
        //   .eq('partner_type', 'restaurant')
        //   .eq('status', 'active')
        //   .single();
        
        // if (subscriptionData) {
        //   setSubscription({
        //     tier: subscriptionData.plan.tier,
        //     plan: subscriptionData.plan
        //   });
        // }
        
        // For demo purposes, simulate a subscription
        // Randomly assign a tier for demonstration
        const tiers: SubscriptionTier[] = ['standard', 'premium', 'elite'];
        const randomTier = tiers[Math.floor(Math.random() * 3)];
        
        setSubscription({
          tier: randomTier,
          plan: randomTier !== 'standard' ? {
            id: `dummy-${randomTier}`,
            name: randomTier === 'premium' ? 'Premium' : 'Elite',
            tier: randomTier,
            description: randomTier === 'premium' ? 'Plan avancé' : 'Plan premium',
            price: randomTier === 'premium' ? 25000 : 50000,
            interval: 'monthly',
            partner_type: 'restaurant',
            features: [],
            commission_rate: randomTier === 'premium' ? 15 : 10,
            created_at: new Date().toISOString()
          } : null
        });
      } catch (error) {
        console.error("Error loading restaurant stats:", error);
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord restaurant</h1>
        
        <div className="flex items-center gap-3">
          {subscription.tier !== 'standard' && (
            <PremiumBadge tier={subscription.tier} />
          )}
          
          <Button 
            variant={subscription.tier === 'standard' ? 'default' : 'outline'}
            onClick={() => navigate('/restaurant/subscription/plans')}
            className="flex items-center gap-2"
          >
            <Crown className={`h-4 w-4 ${subscription.tier === 'standard' ? 'text-white' : 'text-amber-500'}`} />
            {subscription.tier === 'standard' ? 'Passer au premium' : 'Gérer l\'abonnement'}
          </Button>
        </div>
      </div>
      
      {subscription.tier === 'standard' && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Crown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Passez au plan Premium</h3>
                <p className="text-muted-foreground">
                  Bénéficiez d'une meilleure visibilité et de commissions réduites
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/restaurant/subscription/plans')}>
              Découvrir les avantages
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Commandes totales</h2>
              <p className="text-2xl font-bold">{stats?.totalOrders}</p>
            </div>
          </div>
        </Card>

        {/* Average Rating */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Note moyenne</h2>
              <p className="text-2xl font-bold">{stats?.averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Commandes en attente</h2>
              <p className="text-2xl font-bold">{stats?.pendingOrders}</p>
            </div>
          </div>
        </Card>

        {/* Preparing Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ChefHat className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">En préparation</h2>
              <p className="text-2xl font-bold">{stats?.preparingOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission Information */}
      {subscription.plan && (
        <Card className="p-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${subscription.tier === 'premium' ? 'bg-primary/10' : 'bg-amber-100'}`}>
                <Percent className={`h-6 w-6 ${subscription.tier === 'premium' ? 'text-primary' : 'text-amber-600'}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Commission préférentielle</h3>
                <p className="text-muted-foreground">
                  Votre taux: <span className="font-semibold">{subscription.plan.commission_rate}%</span>
                  {subscription.tier !== 'elite' && (
                    <span className="text-sm ml-2">
                      (Économisez {subscription.tier === 'premium' ? '5%' : '10%'} par rapport au tarif standard)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {subscription.tier === 'premium' && (
              <Button variant="outline" onClick={() => navigate('/restaurant/subscription/plans')}>
                Passer à Elite pour 10%
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <h3 className="text-xl font-bold mt-12 mb-6">Actions rapides</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          variant="outline"
          className="h-auto py-6 justify-start"
          onClick={() => navigate("/restaurant/orders")}
        >
          <ShoppingBag className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-medium">Gérer les commandes</div>
            <div className="text-sm text-muted-foreground">Voir et traiter les commandes</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto py-6 justify-start"
          onClick={() => navigate("/restaurant/menu")}
        >
          <Store className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-medium">Gérer le menu</div>
            <div className="text-sm text-muted-foreground">Ajouter ou modifier des plats</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto py-6 justify-start"
          onClick={() => navigate("/restaurant/analytics")}
        >
          <BarChart4 className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-medium">Statistiques</div>
            <div className="text-sm text-muted-foreground">Analyser les performances</div>
          </div>
        </Button>
        
        {subscription.tier !== 'standard' && (
          <>
            <Button
              variant="outline"
              className="h-auto py-6 justify-start"
              onClick={() => navigate("/restaurant/promotions")}
            >
              <TrendingUp className="w-6 h-6 mr-4" />
              <div className="text-left">
                <div className="font-medium">Promotions premium</div>
                <div className="text-sm text-muted-foreground">Gérer vos mises en avant</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-6 justify-start"
              onClick={() => navigate("/restaurant/settings")}
            >
              <Settings className="w-6 h-6 mr-4" />
              <div className="text-left">
                <div className="font-medium">Paramètres avancés</div>
                <div className="text-sm text-muted-foreground">Gérer vos préférences</div>
              </div>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
