import { useState, useEffect } from 'react'
import { supabase, Restaurant } from '@/lib/supabase'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_open', true)
        .order('name')

      if (error) {
        throw error
      }

      setRestaurants(data || [])
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des restaurants')
    } finally {
      setLoading(false)
    }
  }

  const fetchNearbyRestaurants = async (latitude: number, longitude: number, radius: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      
      // Calcul approximatif de la distance (formule de Haversine)
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_open', true)
        .order('name')

      if (error) {
        throw error
      }

      // Filtrer par distance (simplifié pour l'exemple)
      const nearbyRestaurants = data?.filter(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return false
        
        const distance = calculateDistance(
          latitude, longitude,
          restaurant.latitude, restaurant.longitude
        )
        return distance <= radius
      }) || []

      setRestaurants(nearbyRestaurants)
    } catch (err) {
      console.error('Error fetching nearby restaurants:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des restaurants à proximité')
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    fetchNearbyRestaurants
  }
} 