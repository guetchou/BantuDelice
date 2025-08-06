
import { useState, useEffect } from 'react';
import apiService from '@/services/api';
import { DeliveryRequest, DeliveryStatus } from '@/types/delivery';
import { useToast } from '@/hooks/use-toast';

export function useDeliveryOrderRating(orderId: string) {
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRatedDelivery, setHasRatedDelivery] = useState(false);
  const [hasRatedDriver, setHasRatedDriver] = useState(false);
  const [tablesExist, setTablesExist] = useState({
    delivery_requests: false,
    delivery_driver_ratings: false
  });
  const { toast } = useToast();

  // Vérifier si les tables nécessaires existent
  useEffect(() => {
    const checkTables = async () => {
      try {
        // Vérifier la table delivery_requests
        const { count: requestsCount, error: requestsError } = await supabase
          .from('delivery_requests')
          .select('*', { count: 'exact', head: true });
          
        setTablesExist(prev => ({
          ...prev,
          delivery_requests: requestsError ? false : true
        }));
        
        // Vérifier la table delivery_driver_ratings
        const { count: ratingsCount, error: ratingsError } = await supabase
          .from('delivery_driver_ratings')
          .select('*', { count: 'exact', head: true });
          
        setTablesExist(prev => ({
          ...prev,
          delivery_driver_ratings: ratingsError ? false : true
        }));
      } catch (error) {
        console.error('Erreur lors de la vérification des tables:', error);
      }
    };
    
    checkTables();
  }, []);

  useEffect(() => {
    const fetchDeliveryRequest = async () => {
      try {
        setLoading(true);
        
        // Si la table n'existe pas, on arrête
        if (!tablesExist.delivery_requests) {
          setLoading(false);
          return;
        }
        
        // Récupérer la demande de livraison
        const { data: requestData, error: requestError } = await supabase
          .from('delivery_requests')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle();
          
        if (requestError && requestError.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération de la demande de livraison:', requestError);
          setLoading(false);
          return;
        }
        
        if (requestData) {
          // Assurer que les propriétés correspondent à l'interface DeliveryRequest
          setDeliveryRequest({
            id: requestData.id,
            order_id: requestData.order_id,
            restaurant_id: requestData.restaurant_id,
            status: requestData.status as DeliveryStatus,
            pickup_address: requestData.pickup_address,
            pickup_latitude: requestData.pickup_latitude,
            pickup_longitude: requestData.pickup_longitude,
            delivery_address: requestData.delivery_address,
            delivery_latitude: requestData.delivery_latitude,
            delivery_longitude: requestData.delivery_longitude,
            assigned_driver_id: requestData.assigned_driver_id,
            requested_at: requestData.requested_at,
            accepted_at: requestData.accepted_at,
            completed_at: requestData.completed_at,
            cancelled_at: requestData.cancelled_at,
            delivery_fee: requestData.delivery_fee,
            is_external: requestData.is_external,
            external_service_id: requestData.external_service_id,
            notes: requestData.notes,
            priority: requestData.priority || 'normal',
            estimated_distance: requestData.estimated_distance,
            estimated_duration: requestData.estimated_duration,
            delivery_time: requestData.delivery_time,
            delivery_instructions: requestData.delivery_instructions,
            pickup_time: requestData.pickup_time,
            distance_km: requestData.distance_km,
            delivery_type: requestData.delivery_type as any
          });
        
          // Vérifier si l'utilisateur a déjà évalué la livraison
          const { data: { user } } = await apiService.auth.getUser();
          
          if (user && requestData) {
            // Vérifier notation restaurant
            const { data: restaurantRating } = await supabase
              .from('detailed_restaurant_reviews')
              .select('id')
              .eq('order_id', orderId)
              .eq('user_id', user.id)
              .maybeSingle();
                
            setHasRatedDelivery(!!restaurantRating);
            
            // Vérifier notation livreur
            if (requestData.assigned_driver_id && tablesExist.delivery_driver_ratings) {
              const { data: driverRating } = await supabase
                .from('delivery_driver_ratings')
                .select('id')
                .eq('order_id', orderId)
                .eq('user_id', user.id)
                .eq('driver_id', requestData.assigned_driver_id)
                .maybeSingle();
                
              setHasRatedDriver(!!driverRating);
            }
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les informations de livraison',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId && (tablesExist.delivery_requests || tablesExist.delivery_driver_ratings)) {
      fetchDeliveryRequest();
    } else if (!tablesExist.delivery_requests && !tablesExist.delivery_driver_ratings) {
      setLoading(false);
    }
  }, [orderId, toast, tablesExist]);

  const handleRatingSubmitted = () => {
    setHasRatedDelivery(true);
  };
  
  const handleDriverRatingSubmitted = () => {
    setHasRatedDriver(true);
  };

  return {
    deliveryRequest,
    loading,
    hasRatedDelivery,
    hasRatedDriver,
    tablesExist,
    handleRatingSubmitted,
    handleDriverRatingSubmitted
  };
}
