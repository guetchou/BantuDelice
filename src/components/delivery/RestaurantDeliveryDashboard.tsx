
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeliveryDriver, DeliveryRequest, DeliveryType, DeliveryStatus } from '@/types/delivery';
import { Order, OrderStatus } from '@/types/order';
import DeliveryDriverMap from './DeliveryDriverMap';
import { Loader2, Plus, MapPin, Bike, Car, Clock, DollarSign, AlertCircle, CheckCircle, Search } from 'lucide-react';

export default function RestaurantDeliveryDashboard({ restaurantId }: { restaurantId: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState<boolean>(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const { toast } = useToast();

  // Formulaire pour l'ajout de livreur
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    vehicle_type: 'bike' as const,
    commission_rate: 10,
  });

  useEffect(() => {
    if (restaurantId) {
      fetchDrivers();
      fetchPendingOrders();
      fetchDeliveryRequests();
    }
  }, [restaurantId]);

  // Abonnement aux mises à jour en temps réel
  useEffect(() => {
    if (!restaurantId) return;

    const ordersSubscription = supabase
      .channel('restaurant-orders')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => {
          fetchPendingOrders();
        }
      )
      .subscribe();

    const deliverySubscription = supabase
      .channel('delivery-requests')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public', 
          table: 'delivery_requests',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => {
          fetchDeliveryRequests();
        }
      )
      .subscribe();

    const driversSubscription = supabase
      .channel('restaurant-drivers')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public', 
          table: 'delivery_drivers',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => {
          fetchDrivers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(deliverySubscription);
      supabase.removeChannel(driversSubscription);
    };
  }, [restaurantId]);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livreurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .in('status', ['accepted', 'preparing', 'prepared'])
        .eq('delivery_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    }
  };

  const fetchDeliveryRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveryRequests(data || []);
    } catch (error) {
      console.error('Error fetching delivery requests:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les demandes de livraison',
        variant: 'destructive',
      });
    }
  };

  const handleAddDriver = async () => {
    try {
      if (!newDriver.name || !newDriver.phone) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs requis',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('delivery_drivers')
        .insert([
          {
            name: newDriver.name,
            phone: newDriver.phone,
            restaurant_id: restaurantId,
            vehicle_type: newDriver.vehicle_type,
            status: 'available',
            is_available: true,
            average_rating: 0,
            total_deliveries: 0,
            total_earnings: 0,
            commission_rate: newDriver.commission_rate
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Livreur ajouté avec succès',
      });

      // Réinitialiser le formulaire
      setNewDriver({
        name: '',
        phone: '',
        vehicle_type: 'bike',
        commission_rate: 10,
      });

      setIsDriverDialogOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le livreur',
        variant: 'destructive',
      });
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedOrder || !selectedDriver) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner un livreur',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Créer une demande de livraison
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('delivery_requests')
        .insert([
          {
            order_id: selectedOrder.id,
            restaurant_id: restaurantId,
            customer_id: selectedOrder.user_id,
            delivery_address: selectedOrder.delivery_address,
            delivery_instructions: selectedOrder.delivery_instructions,
            delivery_type: 'restaurant',
            status: 'assigned',
            assigned_driver_id: selectedDriver,
            distance_km: 0, // sera mis à jour par un trigger ou une fonction côté backend
            fee: 0, // sera calculé en fonction de la distance
          }
        ])
        .select();

      if (deliveryError) throw deliveryError;

      // Mettre à jour le statut de la commande
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          delivery_status: 'assigned',
        })
        .eq('id', selectedOrder.id);

      if (orderError) throw orderError;

      // Mettre à jour le statut du livreur
      const { error: driverError } = await supabase
        .from('delivery_drivers')
        .update({
          status: 'busy',
          is_available: false,
        })
        .eq('id', selectedDriver);

      if (driverError) throw driverError;

      toast({
        title: 'Succès',
        description: 'Livraison assignée avec succès',
      });

      setIsAssignDialogOpen(false);
      setSelectedOrder(null);
      setSelectedDriver('');
      fetchPendingOrders();
      fetchDeliveryRequests();
      fetchDrivers();
    } catch (error) {
      console.error('Error assigning delivery:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner la livraison',
        variant: 'destructive',
      });
    }
  };

  const handleExternalDelivery = async (order: Order) => {
    try {
      // Créer une demande de livraison externe
      const { data, error } = await supabase
        .from('delivery_requests')
        .insert([
          {
            order_id: order.id,
            restaurant_id: restaurantId,
            customer_id: order.user_id,
            delivery_address: order.delivery_address,
            delivery_instructions: order.delivery_instructions,
            delivery_type: 'external',
            status: 'pending',
            distance_km: 0, // sera mis à jour par le service externe
            fee: 0, // sera calculé par le service externe
          }
        ])
        .select();

      if (error) throw error;

      // Mettre à jour le statut de la commande
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          delivery_status: 'assigned',
        })
        .eq('id', order.id);

      if (orderError) throw orderError;

      toast({
        title: 'Succès',
        description: 'Demande de livraison externe envoyée',
      });

      fetchPendingOrders();
      fetchDeliveryRequests();
    } catch (error) {
      console.error('Error requesting external delivery:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de demander une livraison externe',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Assignée</Badge>;
      case 'picked_up':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Récupérée</Badge>;
      case 'delivering':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">En livraison</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Échouée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const availableDrivers = drivers.filter(driver => driver.status === 'available');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            Commandes en attente
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-primary">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deliveries">
            Livraisons en cours
            {deliveryRequests.filter(d => d.status !== 'delivered' && d.status !== 'failed').length > 0 && (
              <Badge className="ml-2 bg-primary">
                {deliveryRequests.filter(d => d.status !== 'delivered' && d.status !== 'failed').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drivers">
            Livreurs
            {drivers.filter(d => d.status === 'available').length > 0 && (
              <Badge className="ml-2 bg-green-500">
                {drivers.filter(d => d.status === 'available').length} disponibles
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab Content pour les commandes en attente */}
        <TabsContent value="orders" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">Aucune commande en attente de livraison</p>
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Commande #{order.id.substring(0, 8)}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </CardDescription>
                    </div>
                    <Badge variant={order.status === 'prepared' ? 'default' : 'outline'}>
                      {order.status === 'accepted' ? 'Acceptée' : 
                       order.status === 'preparing' ? 'En préparation' : 
                       order.status === 'prepared' ? 'Prête' : order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Adresse de livraison</p>
                        <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                        {order.delivery_instructions && (
                          <p className="text-xs italic mt-1">{order.delivery_instructions}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p>
                        <span className="font-medium">Total:</span>{' '}
                        {order.total_amount.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/30 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsAssignDialogOpen(true);
                    }}
                    disabled={availableDrivers.length === 0}
                  >
                    <Bike className="mr-2 h-4 w-4" />
                    Assigner un livreur
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleExternalDelivery(order)}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Livraison externe
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab Content pour les livraisons en cours */}
        <TabsContent value="deliveries" className="space-y-4">
          {deliveryRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">Aucune livraison en cours</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="h-[300px] mb-4 overflow-hidden rounded-xl border">
                <DeliveryDriverMap restaurantId={restaurantId} />
              </div>
              <div className="space-y-4">
                {deliveryRequests.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Livraison #{delivery.id.substring(0, 8)}</CardTitle>
                          <CardDescription>
                            Commande #{delivery.order_id.substring(0, 8)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Adresse</p>
                            <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {delivery.delivery_type === 'restaurant' ? (
                            <Bike className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Car className="h-4 w-4 text-muted-foreground" />
                          )}
                          <p>
                            <span className="font-medium">Type:</span>{' '}
                            {delivery.delivery_type === 'restaurant' ? 'Livreur interne' : 'Service externe'}
                          </p>
                        </div>
                        {delivery.assigned_driver_id && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Livreur:</span>{' '}
                            {drivers.find(d => d.id === delivery.assigned_driver_id)?.name || 'Inconnu'}
                          </div>
                        )}
                        {delivery.pickup_time && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p>
                              <span className="font-medium">Récupérée à:</span>{' '}
                              {new Date(delivery.pickup_time).toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-muted/30 pt-2">
                      {delivery.status === 'delivered' ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Livrée
                        </Badge>
                      ) : delivery.status === 'failed' ? (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Échouée
                        </Badge>
                      ) : (
                        <Button variant="outline" className="text-blue-600" disabled>
                          <Clock className="mr-1 h-4 w-4" />
                          En cours
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Tab Content pour les livreurs */}
        <TabsContent value="drivers" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un livreur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un livreur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
                  <DialogDescription>
                    Entrez les informations du livreur pour l'ajouter à votre équipe.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                    <Input 
                      id="name" 
                      value={newDriver.name} 
                      onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                    <Input 
                      id="phone" 
                      value={newDriver.phone} 
                      onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="vehicle" className="text-sm font-medium">Type de véhicule</label>
                    <Select
                      value={newDriver.vehicle_type}
                      onValueChange={(value) => setNewDriver({...newDriver, vehicle_type: value as 'bike' | 'scooter' | 'car' | 'walk'})}
                    >
                      <SelectTrigger id="vehicle">
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Vélo</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Voiture</SelectItem>
                        <SelectItem value="walk">À pied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="commission" className="text-sm font-medium">Taux de commission (%)</label>
                    <Input 
                      id="commission" 
                      type="number"
                      min="0"
                      max="100"
                      value={newDriver.commission_rate} 
                      onChange={(e) => setNewDriver({...newDriver, commission_rate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDriverDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddDriver}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {filteredDrivers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">Aucun livreur trouvé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredDrivers.map((driver) => (
                <Card key={driver.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{driver.name}</CardTitle>
                      <Badge 
                        variant={driver.status === 'available' ? 'default' : 'outline'}
                        className={driver.status === 'available' ? 'bg-green-500' : ''}
                      >
                        {driver.status === 'available' ? 'Disponible' : 
                         driver.status === 'busy' ? 'En livraison' :
                         driver.status === 'on_break' ? 'En pause' : 'Hors ligne'}
                      </Badge>
                    </div>
                    <CardDescription>{driver.phone}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <div className="flex items-center">
                          {driver.vehicle_type === 'bike' && <Bike className="h-4 w-4 mr-1" />}
                          {driver.vehicle_type === 'car' && <Car className="h-4 w-4 mr-1" />}
                          {driver.vehicle_type === 'scooter' && <span>🛵</span>}
                          {driver.vehicle_type === 'walk' && <span>🚶</span>}
                          <span className="capitalize">
                            {driver.vehicle_type === 'bike' ? 'Vélo' : 
                             driver.vehicle_type === 'car' ? 'Voiture' :
                             driver.vehicle_type === 'scooter' ? 'Scooter' : 'À pied'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Commission</span>
                        <span>{driver.commission_rate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Livraisons</span>
                        <span>{driver.total_deliveries}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Évaluation</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span>{driver.average_rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog pour assigner un livreur */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un livreur</DialogTitle>
            <DialogDescription>
              Choisissez un livreur disponible pour cette commande.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Informations de la commande:</h4>
              {selectedOrder && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">ID:</span> #{selectedOrder.id.substring(0, 8)}</p>
                  <p className="text-sm"><span className="font-medium">Adresse:</span> {selectedOrder.delivery_address}</p>
                  <p className="text-sm"><span className="font-medium">Montant:</span> {selectedOrder.total_amount.toLocaleString()} FCFA</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="driver" className="text-sm font-medium">Sélectionner un livreur</label>
              <Select
                value={selectedDriver}
                onValueChange={setSelectedDriver}
              >
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Choisir un livreur" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.length === 0 ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Aucun livreur disponible
                    </div>
                  ) : (
                    availableDrivers.map(driver => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} ({driver.vehicle_type === 'bike' ? '🚲' : 
                                        driver.vehicle_type === 'car' ? '🚗' :
                                        driver.vehicle_type === 'scooter' ? '🛵' : '🚶'})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAssignDelivery} disabled={!selectedDriver || availableDrivers.length === 0}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
