
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryRequest, ExternalDeliveryService } from '@/types/delivery';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bike, Package, AlertTriangle, TruckIcon, UserPlus, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types/order';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeliveryManagementProps {
  restaurantId: string;
}

const DeliveryManagement = ({ restaurantId }: DeliveryManagementProps) => {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [externalServices, setExternalServices] = useState<ExternalDeliveryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDriverDialog, setAddDriverDialog] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [assignDriverDialog, setAssignDriverDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedExternalService, setSelectedExternalService] = useState<string>('');
  const [useExternalService, setUseExternalService] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch drivers
        const { data: driversData, error: driversError } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (driversError) throw driversError;
        setDrivers(driversData as DeliveryDriver[]);

        // Fetch pending orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .in('status', ['accepted', 'preparing', 'prepared'])
          .eq('delivery_status', 'pending')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setPendingOrders(ordersData as Order[]);

        // Fetch delivery requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('requested_at', { ascending: false });

        if (requestsError) throw requestsError;
        setDeliveryRequests(requestsData as DeliveryRequest[]);

        // Fetch external delivery services
        const { data: servicesData, error: servicesError } = await supabase
          .from('external_delivery_services')
          .select('*')
          .eq('is_active', true);

        if (servicesError) throw servicesError;
        setExternalServices(servicesData as ExternalDeliveryService[]);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
        toast.error('Erreur lors du chargement des données de livraison');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const driversChannel = supabase
      .channel('drivers-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_drivers',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => fetchData()
      )
      .subscribe();

    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => fetchData()
      )
      .subscribe();

    const requestsChannel = supabase
      .channel('requests-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_requests',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(driversChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, [restaurantId]);

  const handleAddDriver = async () => {
    if (!driverName.trim() || !driverPhone.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { data, error } = await supabase.from('delivery_drivers').insert({
        restaurant_id: restaurantId,
        name: driverName.trim(),
        phone: driverPhone.trim(),
        is_available: true,
        status: 'online',
        vehicle_type: 'bike',
        total_deliveries: 0,
        average_rating: 5,
        commission_rate: 0,
        total_earnings: 0,
        current_latitude: 0,
        current_longitude: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).select().single();

      if (error) throw error;

      toast.success('Livreur ajouté avec succès');
      setDriverName('');
      setDriverPhone('');
      setAddDriverDialog(false);
      setDrivers([...drivers, data as DeliveryDriver]);
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error("Erreur lors de l'ajout du livreur");
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedOrder) return;
    
    try {
      if (useExternalService && selectedExternalService) {
        // Create delivery request with external service
        const { data, error } = await supabase.from('delivery_requests').insert({
          order_id: selectedOrder.id,
          restaurant_id: restaurantId,
          status: 'pending',
          pickup_address: 'Restaurant address', // This should be the restaurant address
          pickup_latitude: 0, // These should be the restaurant coordinates
          pickup_longitude: 0,
          delivery_address: selectedOrder.delivery_address,
          delivery_latitude: 0, // These would ideally come from geocoding the address
          delivery_longitude: 0,
          requested_at: new Date().toISOString(),
          delivery_fee: selectedOrder.delivery_fee || 0,
          is_external: true,
          external_service_id: selectedExternalService,
          priority: 'normal',
          estimated_distance: 0,
          estimated_duration: 0
        }).select().single();

        if (error) throw error;

        // Update order status
        await supabase.from('orders').update({
          delivery_status: 'assigned'
        }).eq('id', selectedOrder.id);

        toast.success('Commande envoyée au service de livraison externe');
      } else if (selectedDriver) {
        // Assign to internal driver
        const { data, error } = await supabase.from('delivery_requests').insert({
          order_id: selectedOrder.id,
          restaurant_id: restaurantId,
          status: 'accepted',
          pickup_address: 'Restaurant address', // This should be the restaurant address
          pickup_latitude: 0, // These should be the restaurant coordinates
          pickup_longitude: 0,
          delivery_address: selectedOrder.delivery_address,
          delivery_latitude: 0, // These would ideally come from geocoding the address
          delivery_longitude: 0,
          assigned_driver_id: selectedDriver,
          requested_at: new Date().toISOString(),
          accepted_at: new Date().toISOString(),
          delivery_fee: selectedOrder.delivery_fee || 0,
          is_external: false,
          priority: 'normal',
          estimated_distance: 0,
          estimated_duration: 0
        }).select().single();

        if (error) throw error;

        // Update order status
        await supabase.from('orders').update({
          delivery_status: 'assigned'
        }).eq('id', selectedOrder.id);

        // Update driver status
        await supabase.from('delivery_drivers').update({
          is_available: false,
          status: 'delivering'
        }).eq('id', selectedDriver);

        // Create initial tracking entry
        await supabase.from('delivery_tracking').insert({
          delivery_request_id: data.id,
          driver_id: selectedDriver,
          order_id: selectedOrder.id,
          status: 'assigned',
          latitude: 0, // Should be the restaurant location
          longitude: 0,
          timestamp: new Date().toISOString()
        });

        toast.success('Commande assignée au livreur');
      } else {
        toast.error('Veuillez sélectionner un livreur ou un service externe');
        return;
      }
      
      setAssignDriverDialog(false);
      setSelectedOrder(null);
      setSelectedDriver('');
      setSelectedExternalService('');
      setUseExternalService(false);
    } catch (error) {
      console.error('Error assigning delivery:', error);
      toast.error("Erreur lors de l'assignation de la livraison");
    }
  };

  const handleToggleDriverStatus = async (driverId: string, currentStatus: boolean) => {
    try {
      await supabase.from('delivery_drivers').update({
        is_available: !currentStatus,
        status: !currentStatus ? 'online' : 'offline'
      }).eq('id', driverId);

      toast.success(`Statut du livreur mis à jour`);
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Erreur lors de la mise à jour du statut du livreur');
    }
  };

  const handleRequestExternalPickup = async (orderId: string) => {
    const order = pendingOrders.find(o => o.id === orderId);
    if (!order) return;

    try {
      setSelectedOrder(order);
      setUseExternalService(true);
      setAssignDriverDialog(true);
    } catch (error) {
      console.error('Error requesting external pickup:', error);
      toast.error('Erreur lors de la demande de ramassage externe');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejeté</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Assigné</Badge>;
      case 'picked_up':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Récupéré</Badge>;
      case 'delivering':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">En livraison</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Livré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Gestion des livraisons</h2>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des livraisons</h2>
        <Button onClick={() => setAddDriverDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un livreur
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Commandes en attente
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-orange-500">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drivers">
            Livreurs
            {drivers.length > 0 && (
              <Badge className="ml-2">{drivers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Livraisons en cours
            {deliveryRequests.filter(r => r.status === 'accepted').length > 0 && (
              <Badge className="ml-2 bg-blue-500">
                {deliveryRequests.filter(r => r.status === 'accepted').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Aucune commande en attente de livraison</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                          <Badge className="ml-2" variant={order.status === 'prepared' ? 'default' : 'outline'}>
                            {order.status === 'accepted' ? 'Acceptée' : 
                             order.status === 'preparing' ? 'En préparation' : 
                             order.status === 'prepared' ? 'Prête' : order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Montant:</span> {order.total_amount.toLocaleString()} XAF
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Adresse:</span> {order.delivery_address}
                        </p>
                        {order.delivery_instructions && (
                          <p className="text-sm mb-1">
                            <span className="font-medium">Instructions:</span> {order.delivery_instructions}
                          </p>
                        )}
                      </div>

                      <div>
                        <Button
                          variant="default"
                          onClick={() => {
                            setSelectedOrder(order);
                            setUseExternalService(false);
                            setAssignDriverDialog(true);
                          }}
                          disabled={order.status !== 'prepared'}
                          className={order.status === 'prepared' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <Bike className="mr-2 h-4 w-4" />
                          Assigner
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRequestExternalPickup(order.id)}>
                              <TruckIcon className="mr-2 h-4 w-4" />
                              Service externe
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Signaler un problème
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="drivers">
          {drivers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Aucun livreur disponible</p>
              <Button onClick={() => setAddDriverDialog(true)} variant="outline" className="mt-4">
                Ajouter un livreur
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {drivers.map((driver) => (
                <Card key={driver.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {driver.profile_picture ? (
                          <img 
                            src={driver.profile_picture} 
                            alt={driver.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-gray-500">
                            {driver.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{driver.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{driver.phone}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            {driver.average_rating.toFixed(1)}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{driver.total_deliveries} livraisons</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline"
                        className={`mr-3 ${driver.is_available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {driver.is_available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant={driver.is_available ? "outline" : "default"}
                            size="sm"
                          >
                            {driver.is_available ? 'Désactiver' : 'Activer'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {driver.is_available ? 'Désactiver le livreur?' : 'Activer le livreur?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {driver.is_available 
                                ? "Le livreur ne recevra plus de nouvelles commandes."
                                : "Le livreur pourra recevoir de nouvelles commandes."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleToggleDriverStatus(driver.id, driver.is_available)}
                            >
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {deliveryRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Aucune livraison en cours</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {deliveryRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">Commande #{request.order_id.slice(0, 8)}</h3>
                          {getStatusBadge(request.status)}
                          {request.is_external && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Service externe
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          Demandé le: {new Date(request.requested_at).toLocaleString()}
                        </p>
                        {request.accepted_at && (
                          <p className="text-sm text-gray-500 mb-1">
                            Accepté le: {new Date(request.accepted_at).toLocaleString()}
                          </p>
                        )}
                        {request.completed_at && (
                          <p className="text-sm text-gray-500 mb-1">
                            Terminé le: {new Date(request.completed_at).toLocaleString()}
                          </p>
                        )}
                        <p className="text-sm mb-1">
                          <span className="font-medium">Adresse:</span> {request.delivery_address}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Frais:</span> {request.delivery_fee.toLocaleString()} XAF
                        </p>
                      </div>

                      {request.status === 'accepted' && (
                        <Badge className="bg-green-100 text-green-800 animate-pulse">
                          En cours de livraison
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Driver Dialog */}
      <Dialog open={addDriverDialog} onOpenChange={setAddDriverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
            <DialogDescription>
              Ajoutez un livreur à votre équipe pour gérer les livraisons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du livreur
              </label>
              <input
                id="name"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Nom complet"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="+242 xx xxx xxxx"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDriverDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddDriver}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog open={assignDriverDialog} onOpenChange={setAssignDriverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un livreur</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>Commande #{selectedOrder.id.slice(0, 8)} pour {selectedOrder.delivery_address}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button
                variant={!useExternalService ? "default" : "outline"}
                onClick={() => setUseExternalService(false)}
                className="flex-1"
              >
                <Bike className="mr-2 h-4 w-4" />
                Livreur interne
              </Button>
              <Button
                variant={useExternalService ? "default" : "outline"}
                onClick={() => setUseExternalService(true)}
                className="flex-1"
              >
                <TruckIcon className="mr-2 h-4 w-4" />
                Service externe
              </Button>
            </div>

            {!useExternalService ? (
              <div className="space-y-2">
                <label htmlFor="driver" className="text-sm font-medium">
                  Sélectionner un livreur
                </label>
                <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un livreur" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers
                      .filter(driver => driver.is_available)
                      .map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} - {driver.average_rating.toFixed(1)} ★
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {drivers.filter(driver => driver.is_available).length === 0 && (
                  <p className="text-sm text-red-500">
                    Aucun livreur disponible. Veuillez activer un livreur ou utiliser un service externe.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">
                  Sélectionner un service de livraison
                </label>
                <Select onValueChange={setSelectedExternalService} value={selectedExternalService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {externalServices.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {service.base_fee.toLocaleString()} XAF
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {externalServices.length === 0 && (
                  <p className="text-sm text-red-500">
                    Aucun service externe disponible.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDriverDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAssignDelivery}
              disabled={(useExternalService && !selectedExternalService) || 
                       (!useExternalService && !selectedDriver)}
            >
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DeliveryManagement;
