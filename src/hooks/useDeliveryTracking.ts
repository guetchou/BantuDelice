
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { toast } from 'sonner';

interface DeliveryLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

interface DeliveryDriver {
  id: string;
  name: string;
  phone?: string;
  photo?: string;
}

export const useDeliveryTracking = (orderId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<DeliveryLocation | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  
  // Charge les données initiales de la livraison
  useEffect(() => {
    const loadDeliveryData = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Trouver les données de livraison associées à cette commande
        const deliveryData = await pb.collection('delivery_requests').getFirstListItem(`order_id="${orderId}"`);
        
        if (deliveryData) {
          setDeliveryId(deliveryData.id);
          setDeliveryStatus(deliveryData.status);
          setEstimatedTime(deliveryData.estimated_delivery_time);
          
          // Si un conducteur est assigné, charger ses informations
          if (deliveryData.driver_id) {
            const driverData = await pb.collection('drivers').getOne(deliveryData.driver_id);
            
            if (driverData) {
              setDriver({
                id: driverData.id,
                name: driverData.name,
                phone: driverData.phone,
                photo: driverData.photo ? pb.files.getUrl(driverData, driverData.photo) : undefined
              });
              
              // Obtenir la dernière position du conducteur
              const locationData = await pb.collection('driver_locations').getFirstListItem(`driver_id="${driverData.id}"`, {
                sort: '-created'
              });
              
              if (locationData) {
                setDriverLocation({
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                  updatedAt: locationData.created
                });
              }
            }
          }
        } else {
          setError("Aucune information de livraison trouvée pour cette commande");
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de livraison:', error);
        setError("Impossible de charger les informations de livraison");
      } finally {
        setLoading(false);
      }
    };
    
    loadDeliveryData();
  }, [orderId]);
  
  // S'abonner aux mises à jour en temps réel
  useEffect(() => {
    if (!deliveryId) return;
    
    // Abonnement aux changements de statut de livraison
    const statusSubscription = pb.collection('delivery_requests').subscribe(deliveryId, (data) => {
      if (data.record) {
        setDeliveryStatus(data.record.status);
        setEstimatedTime(data.record.estimated_delivery_time);
        
        // Notification de mise à jour du statut
        const statusMessages: Record<string, string> = {
          'accepted': 'Votre commande a été acceptée pour livraison',
          'picked_up': 'Votre commande a été récupérée par le livreur',
          'delivering': 'Votre commande est en route !',
          'delivered': 'Votre commande a été livrée avec succès',
          'completed': 'Livraison terminée - Bon appétit !'
        };
        
        if (statusMessages[data.record.status]) {
          toast(statusMessages[data.record.status]);
        }
      }
    });
    
    // Si un conducteur est assigné, s'abonner aux mises à jour de sa position
    let locationSubscription: any = null;
    if (driver) {
      locationSubscription = pb.collection('driver_locations').subscribe(`driver_id="${driver.id}"`, (data) => {
        if (data.record) {
          setDriverLocation({
            latitude: data.record.latitude,
            longitude: data.record.longitude,
            updatedAt: data.record.created
          });
        }
      });
    }
    
    return () => {
      pb.collection('delivery_requests').unsubscribe(deliveryId);
      if (locationSubscription && driver) {
        pb.collection('driver_locations').unsubscribe();
      }
    };
  }, [deliveryId, driver]);
  
  return {
    loading,
    error,
    deliveryId,
    deliveryStatus,
    estimatedTime,
    driver,
    driverLocation
  };
};
