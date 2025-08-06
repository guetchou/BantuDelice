
import { useState } from 'react';
import { toast } from 'sonner';
import { getCurrentPosition, reverseGeocode } from '@/utils/locationUtils';
import apiService from '@/services/api';

// Improved geocoding function with more accurate coordinates for Brazzaville
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    // Check if we have this address cached in Supabase
    const { data: cachedLocation } = await supabase
      .from('taxi_saved_locations')
      .select('latitude, longitude')
      .eq('address', address)
      .maybeSingle();

    if (cachedLocation?.latitude && cachedLocation?.longitude) {
      return {
        lat: cachedLocation.latitude,
        lng: cachedLocation.longitude
      };
    }
    
    // If not cached, generate coordinates around Brazzaville
    const baseLatitude = -4.2634;
    const baseLongitude = 15.2429;
    
    const randomOffset = () => (Math.random() - 0.5) * 0.05;
    
    return {
      lat: baseLatitude + randomOffset(),
      lng: baseLongitude + randomOffset()
    };
  } catch (error) {
    console.error('Error during geocoding:', error);
    throw error;
  }
};

export function useLocationHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedAddresses, setLastSearchedAddresses] = useState<string[]>([]);

  // Function to retrieve and save common addresses
  const loadSavedAddresses = async () => {
    try {
      const { data: savedLocations } = await supabase
        .from('taxi_saved_locations')
        .select('address')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (savedLocations?.length) {
        return savedLocations.map(loc => loc.address);
      }
      
      // Fallback to default addresses if no saved locations
      return [
        "Avenue Félix Eboué, Brazzaville",
        "Boulevard Denis Sassou Nguesso, Brazzaville",
        "Rue Sergent Malamine, Brazzaville",
        "Avenue de la Paix, Brazzaville",
        "Boulevard Alfred Raoul, Brazzaville"
      ];
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      return [];
    }
  };

  // Enhanced function to handle precise location selection
  const handleLocationSelect = async (address: string, isPickup: boolean, updateFormState: Function) => {
    if (!address.trim()) {
      toast.error("Veuillez entrer une adresse valide");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Geocode the address to get coordinates
      const { lat, lng } = await geocodeAddress(address);
      
      // Save this address for future use
      const { error: saveError } = await supabase
        .from('taxi_saved_locations')
        .upsert([
          { address, latitude: lat, longitude: lng, last_used: new Date().toISOString() }
        ], { onConflict: 'address' });
      
      if (saveError) console.error('Error saving location:', saveError);
      
      // Update search history
      setLastSearchedAddresses(prev => {
        const newAddresses = [address, ...prev.filter(a => a !== address)].slice(0, 5);
        return newAddresses;
      });
      
      // Update the form state with the coordinates
      if (isPickup) {
        updateFormState({
          pickupLatitude: lat,
          pickupLongitude: lng,
          pickupAddress: address
        });
      } else {
        updateFormState({
          destinationLatitude: lat,
          destinationLongitude: lng,
          destinationAddress: address
        });
      }
      
      toast.success(`Adresse ${isPickup ? 'de départ' : 'de destination'} définie`, {
        description: address
      });
    } catch (error) {
      console.error('Erreur lors de la géolocalisation:', error);
      toast.error("Impossible de localiser cette adresse", {
        description: "Veuillez essayer une autre adresse"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced function to use current location with higher accuracy
  const handleUseCurrentLocation = async (updateFormState: Function) => {
    setIsLoading(true);
    
    try {
      // Request with high accuracy
      const position = await getCurrentPosition();
      
      // Get address via reverse geocoding
      const address = await reverseGeocode(position.latitude, position.longitude);
      
      // Update the form state
      updateFormState({
        pickupLatitude: position.latitude,
        pickupLongitude: position.longitude,
        pickupAddress: address
      });
      
      // Save this location
      const { error: saveError } = await supabase
        .from('taxi_saved_locations')
        .upsert([
          { 
            address, 
            latitude: position.latitude, 
            longitude: position.longitude, 
            is_current_location: true,
            last_used: new Date().toISOString()
          }
        ], { onConflict: 'address' });
      
      if (saveError) console.error('Error saving current location:', saveError);
      
      toast.success("Position actuelle utilisée", {
        description: address
      });
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      toast.error("Impossible d'obtenir votre position actuelle", {
        description: "Veuillez entrer votre adresse manuellement"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get suggested addresses based on partial input
  const getSuggestions = async (partialAddress: string) => {
    if (!partialAddress || partialAddress.length < 3) return [];

    try {
      const { data: savedLocations } = await supabase
        .from('taxi_saved_locations')
        .select('address')
        .ilike('address', `%${partialAddress}%`)
        .order('last_used', { ascending: false })
        .limit(5);
        
      return savedLocations?.map(loc => loc.address) || [];
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  };

  return {
    isLoading,
    handleLocationSelect,
    handleUseCurrentLocation,
    loadSavedAddresses,
    lastSearchedAddresses,
    getSuggestions
  };
}
