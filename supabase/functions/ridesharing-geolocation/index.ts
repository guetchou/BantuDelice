import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (path) {
      case 'nearby-rides':
        return await handleNearbyRides(req, supabaseClient)
      case 'create-ride':
        return await handleCreateRide(req, supabaseClient)
      case 'join-ride':
        return await handleJoinRide(req, supabaseClient)
      case 'route':
        return await handleCalculateRoute(req, supabaseClient)
      case 'ride-details':
        return await handleGetRideDetails(req, supabaseClient)
      case 'update-ride-location':
        return await handleUpdateRideLocation(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Obtenir les trajets à proximité
async function handleNearbyRides(req: Request, supabase: any) {
  const url = new URL(req.url)
  const lat = parseFloat(url.searchParams.get('lat') || '0')
  const lng = parseFloat(url.searchParams.get('lng') || '0')
  const radius = parseFloat(url.searchParams.get('radius') || '5')

  try {
    // Récupérer les trajets à proximité
    const { data: rides, error } = await supabase
      .from('ridesharing_rides')
      .select(`
        *,
        driver:users!ridesharing_rides_driver_id_fkey(
          id,
          full_name,
          avatar_url,
          rating
        ),
        passengers:ridesharing_passengers(
          id,
          user_id,
          pickup_location,
          destination_location
        )
      `)
      .gte('pickup_lat', lat - radius / 111)
      .lte('pickup_lat', lat + radius / 111)
      .gte('pickup_lng', lng - radius / (111 * Math.cos(lat * Math.PI / 180)))
      .lte('pickup_lng', lng + radius / (111 * Math.cos(lat * Math.PI / 180)))
      .eq('status', 'active')
      .gt('available_seats', 0)

    if (error) throw error

    // Filtrer par distance exacte et calculer les informations supplémentaires
    const nearbyRides = rides
      .filter(ride => {
        const distance = calculateDistance(lat, lng, ride.pickup_lat, ride.pickup_lng)
        return distance <= radius
      })
      .map(ride => ({
        ...ride,
        distance: calculateDistance(lat, lng, ride.pickup_lat, ride.pickup_lng),
        estimated_duration: calculateEstimatedDuration(ride.pickup_lat, ride.pickup_lng, ride.destination_lat, ride.destination_lng)
      }))
      .sort((a, b) => a.distance - b.distance)

    return new Response(JSON.stringify({ rides: nearbyRides }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Créer un nouveau trajet
async function handleCreateRide(req: Request, supabase: any) {
  try {
    const { user } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const rideData = await req.json()
    
    // Valider les données
    if (!rideData.pickup_location || !rideData.destination_location || !rideData.price) {
      return new Response(JSON.stringify({ error: 'Données manquantes' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Créer le trajet
    const { data: ride, error } = await supabase
      .from('ridesharing_rides')
      .insert({
        driver_id: user.id,
        pickup_lat: rideData.pickup_location[1],
        pickup_lng: rideData.pickup_location[0],
        pickup_address: rideData.pickup_address,
        destination_lat: rideData.destination_location[1],
        destination_lng: rideData.destination_location[0],
        destination_address: rideData.destination_address,
        price: rideData.price,
        available_seats: rideData.available_seats || 4,
        departure_time: rideData.departure_time,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ ride }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Rejoindre un trajet
async function handleJoinRide(req: Request, supabase: any) {
  try {
    const { user } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { rideId, pickup_location, destination_location, passenger_count = 1 } = await req.json()

    // Vérifier que le trajet existe et a des places disponibles
    const { data: ride, error: rideError } = await supabase
      .from('ridesharing_rides')
      .select('*')
      .eq('id', rideId)
      .eq('status', 'active')
      .single()

    if (rideError || !ride) {
      return new Response(JSON.stringify({ error: 'Trajet non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (ride.available_seats < passenger_count) {
      return new Response(JSON.stringify({ error: 'Pas assez de places disponibles' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Ajouter le passager
    const { data: passenger, error: passengerError } = await supabase
      .from('ridesharing_passengers')
      .insert({
        ride_id: rideId,
        user_id: user.id,
        pickup_lat: pickup_location[1],
        pickup_lng: pickup_location[0],
        destination_lat: destination_location[1],
        destination_lng: destination_location[0],
        passenger_count
      })
      .select()
      .single()

    if (passengerError) throw passengerError

    // Mettre à jour le nombre de places disponibles
    await supabase
      .from('ridesharing_rides')
      .update({ available_seats: ride.available_seats - passenger_count })
      .eq('id', rideId)

    return new Response(JSON.stringify({ 
      message: 'Trajet réservé avec succès',
      passenger,
      ride: { ...ride, available_seats: ride.available_seats - passenger_count }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Calculer l'itinéraire
async function handleCalculateRoute(req: Request, supabase: any) {
  try {
    const { fromLat, fromLng, toLat, toLng } = await req.json()

    // Utiliser l'API Mapbox pour calculer l'itinéraire
    const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${mapboxToken}`
    )

    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun itinéraire trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const route = data.routes[0]
    
    return new Response(JSON.stringify({
      coordinates: route.geometry.coordinates,
      distance: route.distance / 1000, // km
      duration: Math.round(route.duration / 60), // minutes
      price: calculateRidePrice(route.distance / 1000)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Obtenir les détails d'un trajet
async function handleGetRideDetails(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const rideId = url.searchParams.get('rideId')

    if (!rideId) {
      return new Response(JSON.stringify({ error: 'ID du trajet requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: ride, error } = await supabase
      .from('ridesharing_rides')
      .select(`
        *,
        driver:users!ridesharing_rides_driver_id_fkey(
          id,
          full_name,
          avatar_url,
          rating,
          phone
        ),
        passengers:ridesharing_passengers(
          id,
          user_id,
          pickup_location,
          destination_location,
          passenger_count,
          user:users(
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', rideId)
      .single()

    if (error || !ride) {
      return new Response(JSON.stringify({ error: 'Trajet non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ ride }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Mettre à jour la position d'un trajet
async function handleUpdateRideLocation(req: Request, supabase: any) {
  try {
    const { user } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { rideId, lat, lng } = await req.json()

    // Vérifier que l'utilisateur est le conducteur du trajet
    const { data: ride, error: rideError } = await supabase
      .from('ridesharing_rides')
      .select('driver_id')
      .eq('id', rideId)
      .single()

    if (rideError || !ride || ride.driver_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Mettre à jour la position
    const { error } = await supabase
      .from('ridesharing_rides')
      .update({ 
        current_lat: lat,
        current_lng: lng,
        updated_at: new Date().toISOString()
      })
      .eq('id', rideId)

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Position mise à jour' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Fonctions utilitaires
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateEstimatedDuration(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const distance = calculateDistance(lat1, lng1, lat2, lng2)
  // Estimation basée sur une vitesse moyenne de 30 km/h en ville
  return Math.round(distance / 30 * 60) // minutes
}

function calculateRidePrice(distance: number): number {
  // Tarification basique : 500 FCFA de base + 200 FCFA par km
  return Math.round(500 + distance * 200)
} 