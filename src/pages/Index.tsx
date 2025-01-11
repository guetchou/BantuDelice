import { Users, DollarSign, Target, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import DashboardCard from "@/components/DashboardCard";
import DashboardChart from "@/components/DashboardChart";
import DashboardBarChart from "@/components/DashboardBarChart";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IndexProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface Order {
  id: string;
  status: string;
  delivery_address: string;
  total_amount: number;
  created_at: string;
  rating?: number;
}

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'accepted':
      return 'bg-blue-500/20 text-blue-500';
    case 'preparing':
      return 'bg-purple-500/20 text-purple-500';
    case 'ready':
      return 'bg-emerald-500/20 text-emerald-500';
    case 'delivered':
      return 'bg-green-500/20 text-green-500';
    case 'cancelled':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const Index = ({ isCollapsed, setIsCollapsed }: IndexProps) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [authError, setAuthError] = useState<string>("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    completionRate: 0,
    averageRating: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Email address is invalid':
          return 'Veuillez utiliser une adresse email valide (ex: exemple@gmail.com)';
        case 'User already registered':
          return 'Un compte existe déjà avec cette adresse email';
        case 'Invalid login credentials':
          return 'Email ou mot de passe incorrect';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setAuthError("");
      }
      if (event === 'USER_UPDATED') {
        const handleError = async () => {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setAuthError(getErrorMessage(error));
          }
        };
        handleError();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-900 to-cyan-900">
        <h1 className="text-3xl font-bold text-white mb-8">Buntudelice</h1>
        <div className="w-full max-w-md glass-effect p-8 rounded-lg">
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  button_label: 'S\'inscrire',
                  loading_button_label: 'Inscription...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: 'Vous n\'avez pas de compte ? Inscrivez-vous'
                },
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: 'Déjà un compte ? Connectez-vous'
                }
              }
            }}
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-cyan-900 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
        isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
      }`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-emerald-200 mt-1">Bienvenue ! Voici votre aperçu en temps réel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <DashboardCard
            title="Commandes Totales"
            value={stats.totalOrders.toString()}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Revenu"
            value={`${stats.totalRevenue.toLocaleString()} FCFA`}
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Livraisons Actives"
            value={stats.activeDeliveries.toString()}
            icon={<Target className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardCard
            title="Taux de Complétion"
            value={`${stats.completionRate}%`}
            icon={<Award className="h-6 w-6" />}
            trend={{ value: 3, isPositive: true }}
          />
          <DashboardCard
            title="Note Moyenne"
            value={`${stats.averageRating}/5`}
            icon={<Star className="h-6 w-6" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardChart />
          <DashboardBarChart />
        </div>

        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Commandes en Temps Réel</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.delivery_address}</TableCell>
                    <TableCell>{order.total_amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {order.rating ? `${order.rating}/5` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
