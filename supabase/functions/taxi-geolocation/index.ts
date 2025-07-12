import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        return await handleGet(path, url, supabaseClient)
      case 'POST':
        return await handlePost(path, req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleGet(path: string, url: URL, supabase: any) {
  const { searchParams } = url

  switch (path) {
    case 'nearby-drivers':
      const lat = parseFloat(searchParams.get('lat') || '0')
      const lng = parseFloat(searchParams.get('lng') || '0')
      const radius = parseFloat(searchParams.get('radius') || '2')
      
      // Simuler des chauffeurs à proximité
      const drivers = [
        {
          id: '1',
          name: 'Jean Taxi',
          rating: 4.8,
          vehicle: 'Toyota Corolla',
          plate: 'CG-1234-AB',
          coordinates: [lng + 0.001, lat + 0.001],
          distance: 0.2,
          available: true
        },
        {
          id: '2',
          name: 'Marie Chauffeur',
          rating: 4.9,
          vehicle: 'Honda Civic',
          plate: 'CG-5678-CD',
          coordinates: [lng - 0.001, lat + 0.002],
          distance: 0.5,
          available: true
        }
      ]

      return new Response(JSON.stringify({ drivers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'route':
      const fromLat = parseFloat(searchParams.get('fromLat') || '0')
      const fromLng = parseFloat(searchParams.get('fromLng') || '0')
      const toLat = parseFloat(searchParams.get('toLat') || '0')
      const toLng = parseFloat(searchParams.get('toLng') || '0')
      
      // Calculer la distance et le temps estimé
      const distance = calculateDistance(fromLat, fromLng, toLat, toLng)
      const duration = Math.round(distance * 2) // 2 min par km
      const fare = Math.round(distance * 500) // 500 FCFA par km
      
      return new Response(JSON.stringify({
        distance: distance.toFixed(2),
        duration,
        fare,
        route: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[fromLng, fromLat], [toLng, toLat]]
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'driver-location':
      const driverId = searchParams.get('driverId')
      
      // Simuler la position du chauffeur
      const driverLocation = {
        id: driverId,
        coordinates: [15.2429 + (Math.random() - 0.5) * 0.01, -4.2634 + (Math.random() - 0.5) * 0.01],
        timestamp: new Date().toISOString(),
        status: 'en_route'
      }

      return new Response(JSON.stringify({ location: driverLocation }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

async function handlePost(path: string, req: Request, supabase: any) {
  const body = await req.json()

  switch (path) {
    case 'book-taxi':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const booking = {
        id: crypto.randomUUID(),
        user_id: user.id,
        pickup_address: body.pickup_address,
        pickup_coordinates: body.pickup_coordinates,
        destination_address: body.destination_address,
        destination_coordinates: body.destination_coordinates,
        driver_id: body.driver_id,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('taxi_bookings')
        .insert(booking)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ booking: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'update-driver-location':
      const { data: { user: driver } } = await supabase.auth.getUser()
      if (!driver) throw new Error('Unauthorized')

      const locationUpdate = {
        driver_id: driver.id,
        coordinates: body.coordinates,
        timestamp: new Date().toISOString(),
        status: body.status || 'available'
      }

      // Mettre à jour la position du chauffeur
      const { error } = await supabase
        .from('driver_locations')
        .upsert(locationUpdate, { onConflict: 'driver_id' })

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 