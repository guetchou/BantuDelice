
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryRequest, DeliveryRoute } from '@/types/delivery';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, LocateFixed, ArrowUp, ArrowDown, Package, MapIcon, Clock, RotateCw, PlusCircle, Bike, Car, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { calculateDistance, estimateDeliveryTime } from '@/utils/deliveryOptimization';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RouteOptimizationProps {
  driverId: string;
}

// Enhanced DeliveryLocation with additional properties needed for route optimization
interface EnhancedDeliveryLocation {
  latitude: number;
  longitude: number;
  request_id?: string;
  type?: 'pickup' | 'delivery';
  is_priority?: boolean;
}

export default function RouteOptimization({ driverId }: RouteOptimizationProps) {
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [pendingRequests, setPendingRequests] = useState<DeliveryRequest[]>([]);
  const [activeRoutes, setActiveRoutes] = useState<DeliveryRoute[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [openRouteId, setOpenRouteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'time' | 'priority'

  useEffect(() => {
    fetchDriverData();
  }, [driverId]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      
      // Fetch driver info
      const { data: driverData, error: driverError } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
      
      if (driverError) throw driverError;
      setDriver(driverData as DeliveryDriver);
      
      // Fetch pending delivery requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('status', 'pending')
        .is('assigned_driver_id', null)
        .order('created_at', { ascending: true });
      
      if (requestsError) throw requestsError;
      setPendingRequests(requestsData as DeliveryRequest[]);
      
      // Fetch active routes
      const { data: routesData, error: routesError } = await supabase
        .from('delivery_routes')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (routesError) throw routesError;
      setActiveRoutes(routesData as DeliveryRoute[]);
      
    } catch (error) {
      console.error('Error fetching driver data:', error);
      toast.error('Erreur lors du chargement des données du livreur');
    } finally {
      setLoading(false);
    }
  };

  const optimizeRoute = async () => {
    if (selectedRequests.length === 0) {
      toast.error('Veuillez sélectionner au moins une livraison');
      return;
    }
    
    try {
      setIsCalculating(true);
      
      // Get details of selected requests
      const selectedRequestsData = pendingRequests.filter(req => selectedRequests.includes(req.id));
      
      if (!driver?.current_latitude || !driver?.current_longitude) {
        toast.error('Position du livreur inconnue');
        return;
      }
      
      // Start from driver's current position
      const startPoint: EnhancedDeliveryLocation = {
        latitude: driver.current_latitude,
        longitude: driver.current_longitude
      };
      
      // Calculate all distances between points
      const points: EnhancedDeliveryLocation[] = [
        startPoint,
        ...selectedRequestsData.map(req => ({
          request_id: req.id,
          latitude: req.pickup_latitude || 0,
          longitude: req.pickup_longitude || 0,
          type: 'pickup' as const,
          is_priority: req.is_priority
        })),
        ...selectedRequestsData.map(req => ({
          request_id: req.id,
          latitude: req.delivery_latitude || 0,
          longitude: req.delivery_longitude || 0,
          type: 'delivery' as const,
          is_priority: req.is_priority
        }))
      ];
      
      // For simplicity, use a basic nearest neighbor algorithm
      // In a real application, you'd use a more sophisticated algorithm
      let currentPoint = points[0];
      const visitedPoints: EnhancedDeliveryLocation[] = [currentPoint];
      const remainingPoints = points.slice(1);
      
      // For each request, we need to visit both pickup and delivery points
      // Pickup must come before delivery
      while (remainingPoints.length > 0) {
        // Prioritize pickups for requests that already have some points in the route
        const requestsInRoute = visitedPoints
          .filter(p => p.request_id)
          .map(p => p.request_id);
        
        const pickupsNeeded = remainingPoints
          .filter(p => p.type === 'pickup' && requestsInRoute.includes(p.request_id));
        
        if (pickupsNeeded.length > 0) {
          // Find the nearest pickup point for requests already in route
          let nearestPoint = pickupsNeeded[0];
          let minDistance = calculateDistance(
            currentPoint.latitude,
            currentPoint.longitude,
            nearestPoint.latitude,
            nearestPoint.longitude
          );
          
          for (let i = 1; i < pickupsNeeded.length; i++) {
            const distance = calculateDistance(
              currentPoint.latitude,
              currentPoint.longitude,
              pickupsNeeded[i].latitude,
              pickupsNeeded[i].longitude
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestPoint = pickupsNeeded[i];
            }
          }
          
          visitedPoints.push(nearestPoint);
          const index = remainingPoints.findIndex(p => p.request_id === nearestPoint.request_id && p.type === nearestPoint.type);
          remainingPoints.splice(index, 1);
          currentPoint = nearestPoint;
          continue;
        }
        
        // Check if there are priority deliveries
        const priorityPoints = remainingPoints.filter(p => p.is_priority);
        
        if (priorityPoints.length > 0) {
          // Find the nearest priority point
          let nearestPoint = priorityPoints[0];
          let minDistance = calculateDistance(
            currentPoint.latitude,
            currentPoint.longitude,
            nearestPoint.latitude,
            nearestPoint.longitude
          );
          
          for (let i = 1; i < priorityPoints.length; i++) {
            const distance = calculateDistance(
              currentPoint.latitude,
              currentPoint.longitude,
              priorityPoints[i].latitude,
              priorityPoints[i].longitude
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestPoint = priorityPoints[i];
            }
          }
          
          // If it's a delivery point, check if pickup exists in visited points
          if (nearestPoint.type === 'delivery') {
            const pickupExists = visitedPoints.some(
              p => p.request_id === nearestPoint.request_id && p.type === 'pickup'
            );
            
            if (!pickupExists) {
              // Find the pickup point and add it first
              const pickupPoint = remainingPoints.find(
                p => p.request_id === nearestPoint.request_id && p.type === 'pickup'
              );
              
              if (pickupPoint) {
                visitedPoints.push(pickupPoint);
                const pickupIndex = remainingPoints.findIndex(
                  p => p.request_id === pickupPoint.request_id && p.type === pickupPoint.type
                );
                remainingPoints.splice(pickupIndex, 1);
                currentPoint = pickupPoint;
                continue;
              }
            }
          }
          
          visitedPoints.push(nearestPoint);
          const index = remainingPoints.findIndex(
            p => p.request_id === nearestPoint.request_id && p.type === nearestPoint.type
          );
          remainingPoints.splice(index, 1);
          currentPoint = nearestPoint;
          continue;
        }
        
        // Find the nearest point
        let nearestPoint = remainingPoints[0];
        let minDistance = calculateDistance(
          currentPoint.latitude,
          currentPoint.longitude,
          nearestPoint.latitude,
          nearestPoint.longitude
        );
        
        for (let i = 1; i < remainingPoints.length; i++) {
          const distance = calculateDistance(
            currentPoint.latitude,
            currentPoint.longitude,
            remainingPoints[i].latitude,
            remainingPoints[i].longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = remainingPoints[i];
          }
        }
        
        // If it's a delivery point, check if pickup exists in visited points
        if (nearestPoint.type === 'delivery') {
          const pickupExists = visitedPoints.some(
            p => p.request_id === nearestPoint.request_id && p.type === 'pickup'
          );
          
          if (!pickupExists) {
            // Find the pickup point and add it first
            const pickupPoint = remainingPoints.find(
              p => p.request_id === nearestPoint.request_id && p.type === 'pickup'
            );
            
            if (pickupPoint) {
              visitedPoints.push(pickupPoint);
              const pickupIndex = remainingPoints.findIndex(
                p => p.request_id === pickupPoint.request_id && p.type === pickupPoint.type
              );
              remainingPoints.splice(pickupIndex, 1);
              currentPoint = pickupPoint;
              continue;
            }
          }
        }
        
        visitedPoints.push(nearestPoint);
        const index = remainingPoints.findIndex(
          p => p.request_id === nearestPoint.request_id && p.type === nearestPoint.type
        );
        remainingPoints.splice(index, 1);
        currentPoint = nearestPoint;
      }
      
      // Calculate total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;
      
      for (let i = 0; i < visitedPoints.length - 1; i++) {
        const distance = calculateDistance(
          visitedPoints[i].latitude,
          visitedPoints[i].longitude,
          visitedPoints[i + 1].latitude,
          visitedPoints[i + 1].longitude
        );
        
        totalDistance += distance;
        totalDuration += estimateDeliveryTime(distance, driver.vehicle_type || 'bike');
      }
      
      // Format the result
      const waypoints = visitedPoints.slice(1).map((point, index) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        type: point.type,
        request_id: point.request_id,
        order: index + 1
      }));
      
      setOptimizedRoute({
        waypoints,
        totalDistance,
        totalDuration,
        requestIds: selectedRequests
      });
      
      // Show confirmation toast
      toast.success(
        `Itinéraire optimisé: ${totalDistance.toFixed(1)} km, environ ${(totalDuration / 60).toFixed(0)} minutes`
      );
      
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast.error('Erreur lors de l\'optimisation de l\'itinéraire');
    } finally {
      setIsCalculating(false);
    }
  };

  const createRoute = async () => {
    if (!optimizedRoute) {
      toast.error('Veuillez d\'abord optimiser l\'itinéraire');
      return;
    }
    
    try {
      // Calculate estimated end time
      const now = new Date();
      const endTime = new Date(now.getTime() + optimizedRoute.totalDuration * 1000);
      
      // Create the route
      const { data: route, error } = await supabase
        .from('delivery_routes')
        .insert({
          driver_id: driverId,
          delivery_requests: optimizedRoute.requestIds,
          status: 'active',
          start_time: now.toISOString(),
          estimated_end_time: endTime.toISOString(),
          total_distance: optimizedRoute.totalDistance,
          total_duration: optimizedRoute.totalDuration,
          waypoints: optimizedRoute.waypoints,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the delivery requests
      for (const requestId of optimizedRoute.requestIds) {
        await supabase
          .from('delivery_requests')
          .update({
            assigned_driver_id: driverId,
            status: 'assigned',
            route_optimization: true,
            batch_id: route.id,
            accepted_at: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', requestId);
      }
      
      // Update driver status
      await supabase
        .from('delivery_drivers')
        .update({
          status: 'busy',
          current_deliveries: (driver?.current_deliveries || 0) + optimizedRoute.requestIds.length,
          updated_at: now.toISOString()
        })
        .eq('id', driverId);
      
      toast.success('Nouvel itinéraire créé avec succès');
      
      // Reset state
      setSelectedRequests([]);
      setOptimizedRoute(null);
      
      // Refresh data
      fetchDriverData();
      
    } catch (error) {
      console.error('Error creating route:', error);
      toast.error('Erreur lors de la création de l\'itinéraire');
    }
  };

  const completeDelivery = async (routeId: string, requestId: string) => {
    try {
      // Find the route
      const route = activeRoutes.find(r => r.id === routeId);
      if (!route) return;
      
      // Mark the delivery as completed
      await supabase
        .from('delivery_requests')
        .update({
          status: 'delivered',
          delivery_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      // Update the route
      const updatedRequests = route.delivery_requests.filter(id => id !== requestId);
      
      if (updatedRequests.length === 0) {
        // All deliveries completed, mark route as completed
        await supabase
          .from('delivery_routes')
          .update({
            status: 'completed',
            actual_end_time: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', routeId);
        
        // Update driver status
        await supabase
          .from('delivery_drivers')
          .update({
            status: 'available',
            current_deliveries: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', driverId);
        
      } else {
        // Update the route with remaining deliveries
        await supabase
          .from('delivery_routes')
          .update({
            delivery_requests: updatedRequests,
            updated_at: new Date().toISOString()
          })
          .eq('id', routeId);
        
        // Update driver's current deliveries
        await supabase
          .from('delivery_drivers')
          .update({
            current_deliveries: (driver?.current_deliveries || 0) - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', driverId);
      }
      
      toast.success('Livraison marquée comme terminée');
      fetchDriverData();
      
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast.error('Erreur lors de la mise à jour de la livraison');
    }
  };

  const toggleRequestSelection = (requestId: string) => {
    if (selectedRequests.includes(requestId)) {
      setSelectedRequests(selectedRequests.filter(id => id !== requestId));
    } else {
      const maxConcurrent = driver?.max_concurrent_deliveries || 5;
      if (selectedRequests.length >= maxConcurrent) {
        toast.error(`Vous ne pouvez pas sélectionner plus de ${maxConcurrent} livraisons à la fois`);
        return;
      }
      
      setSelectedRequests([...selectedRequests, requestId]);
    }
  };

  const getRequestById = (requestId: string) => {
    return pendingRequests.find(req => req.id === requestId);
  };

  const toggleRouteExpand = (routeId: string) => {
    if (openRouteId === routeId) {
      setOpenRouteId(null);
    } else {
      setOpenRouteId(routeId);
    }
  };

  const sortRequests = (requests: DeliveryRequest[]) => {
    if (sortBy === 'distance') {
      return [...requests].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortBy === 'time') {
      return [...requests].sort((a, b) => (a.estimated_duration || 0) - (b.estimated_duration || 0));
    } else if (sortBy === 'priority') {
      return [...requests].sort((a, b) => {
        if (a.is_priority && !b.is_priority) return -1;
        if (!a.is_priority && b.is_priority) return 1;
        return 0;
      });
    }
    return requests;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Optimisation des itinéraires</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Optimisation des itinéraires</span>
          {driver?.vehicle_type && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {driver.vehicle_type === 'bike' ? <Bike className="h-3 w-3 mr-1" /> : 
               driver.vehicle_type === 'car' ? <Car className="h-3 w-3 mr-1" /> : null}
              {driver.vehicle_type.charAt(0).toUpperCase() + driver.vehicle_type.slice(1)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Planifiez vos livraisons de manière optimale
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Livraisons disponibles</h3>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Tri: {sortBy === 'distance' ? 'Distance' : 
                           sortBy === 'time' ? 'Temps' : 'Priorité'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('distance')}>
                      Distance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('time')}>
                      Temps estimé
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('priority')}>
                      Priorité
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button size="sm" variant="ghost" onClick={fetchDriverData}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune livraison disponible
                </div>
              ) : (
                <div className="space-y-3">
                  {sortRequests(pendingRequests).map((request) => (
                    <div 
                      key={request.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        selectedRequests.includes(request.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-6 w-6 rounded-full ${
                            selectedRequests.includes(request.id)
                              ? 'bg-primary text-white'
                              : 'bg-muted'
                          } flex items-center justify-center cursor-pointer`}
                          onClick={() => toggleRequestSelection(request.id)}
                        >
                          {selectedRequests.includes(request.id) && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium truncate max-w-[150px]">
                              {request.id.slice(0, 8)}
                            </span>
                            {request.is_priority && (
                              <Badge className="ml-2 bg-red-500 text-white">Prioritaire</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {request.pickup_address.split(',')[0]}
                            </span>
                            <ArrowRight className="h-3 w-3 mx-1" />
                            <span className="truncate max-w-[200px]">
                              {request.delivery_address.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-xs">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{request.distance?.toFixed(1) || '?'} km</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>~{Math.round((request.estimated_duration || 0) / 60) || '?'} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
         


            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sélectionnés:</span>
                <span>{selectedRequests.length}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={optimizeRoute}
                  disabled={selectedRequests.length === 0 || isCalculating}
                  className="flex-1"
                >
                  {isCalculating ? "Optimisation..." : "Optimiser l'itinéraire"}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedRequests([])}
                  disabled={selectedRequests.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </Button>
              </div>
              
              {optimizedRoute && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Itinéraire optimisé</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Distance totale:</span>
                        <span>{optimizedRoute.totalDistance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée estimée:</span>
                        <span>{Math.floor(optimizedRoute.totalDuration / 60)} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nombre de livraisons:</span>
                        <span>{optimizedRoute.requestIds.length}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={createRoute}
                    >
                      Créer l'itinéraire
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Itinéraires actifs</h3>
            
            {activeRoutes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                Aucun itinéraire actif
              </div>
            ) : (
              <div className="space-y-4">
                {activeRoutes.map((route) => (
                  <Collapsible
                    key={route.id}
                    open={openRouteId === route.id}
                    onOpenChange={() => toggleRouteExpand(route.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapIcon className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-semibold">Itinéraire #{route.id.slice(0, 8)}</h4>
                            <p className="text-xs text-muted-foreground">
                              {route.delivery_requests.length} livraisons • {route.total_distance?.toFixed(1)} km
                            </p>
                          </div>
                        </div>
                        
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {openRouteId === route.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="p-4 space-y-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Début:</span>
                            <span>{new Date(route.start_time).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fin estimée:</span>
                            <span>{new Date(route.estimated_end_time).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Livraisons</h5>
                          <div className="space-y-2">
                            {route.delivery_requests.map((requestId) => {
                              const request = getRequestById(requestId);
                              return request ? (
                                <div key={requestId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div>
                                    <div className="font-medium text-sm">{request.delivery_address.split(',')[0]}</div>
                                    <div className="text-xs text-muted-foreground">#{requestId.slice(-4)}</div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => completeDelivery(route.id, requestId)}
                                  >
                                    Terminé
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
