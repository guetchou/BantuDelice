import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabase';
import { useOrders } from '@/hooks/useSupabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Clock, MapPin, Phone, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const orderStatusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: <Clock className="w-4 h-4" /> 
  },
  confirmed: { 
    label: 'Confirmée', 
    color: 'bg-blue-100 text-blue-800', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  preparing: { 
    label: 'En préparation', 
    color: 'bg-orange-100 text-orange-800', 
    icon: <Package className="w-4 h-4" /> 
  },
  delivering: { 
    label: 'En livraison', 
    color: 'bg-purple-100 text-purple-800', 
    icon: <MapPin className="w-4 h-4" /> 
  },
  delivered: { 
    label: 'Livrée', 
    color: 'bg-green-100 text-green-800', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  cancelled: { 
    label: 'Annulée', 
    color: 'bg-red-100 text-red-800', 
    icon: <XCircle className="w-4 h-4" /> 
  }
};

export default function UserOrders() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders(user?.id);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user?.id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders();
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Non connecté</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour voir vos commandes</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Commandes</h1>
          <p className="text-gray-600">Historique de toutes vos commandes</p>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
              <Button onClick={() => window.location.href = '/order'}>
                Passer ma première commande
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const statusConfig = orderStatusConfig[order.status as keyof typeof orderStatusConfig] || 
                                 orderStatusConfig.pending;
              
              return (
                <Card key={order.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Commande #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Détails de livraison</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{order.delivery_address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{order.delivery_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{order.delivery_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Articles commandés</h4>
                        <div className="space-y-1">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Mode de paiement</p>
                          <p className="font-medium">{order.payment_method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {order.status === 'delivered' && (
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" className="w-full">
                          Laisser un avis
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 