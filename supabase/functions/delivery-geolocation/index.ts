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
    case 'track':
      const deliveryId = searchParams.get('deliveryId')
      
      // Simuler le suivi de livraison
      const deliveryTracking = {
        id: deliveryId,
        status: 'en_route',
        current_location: {
          coordinates: [15.2429 + (Math.random() - 0.5) * 0.01, -4.2634 + (Math.random() - 0.5) * 0.01],
          timestamp: new Date().toISOString()
        },
        driver: {
          id: 'driver1',
          name: 'Jean Livreur',
          phone: '+242 06 123 4567',
          vehicle: 'Moto',
          rating: 4.8
        },
        estimated_arrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
        route: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [15.2429, -4.2634],
              [15.2439, -4.2644],
              [15.2449, -4.2654]
            ]
          }
        }
      }

      return new Response(JSON.stringify({ tracking: deliveryTracking }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'nearby-drivers':
      const lat = parseFloat(searchParams.get('lat') || '0')
      const lng = parseFloat(searchParams.get('lng') || '0')
      
      // Simuler des livreurs à proximité
      const drivers = [
        {
          id: 'driver1',
          name: 'Jean Livreur',
          vehicle: 'Moto',
          rating: 4.8,
          coordinates: [lng + 0.001, lat + 0.001],
          distance: 0.3,
          available: true,
          current_delivery: null
        },
        {
          id: 'driver2',
          name: 'Marie Livraison',
          vehicle: 'Scooter',
          rating: 4.9,
          coordinates: [lng - 0.002, lat + 0.002],
          distance: 0.8,
          available: true,
          current_delivery: null
        },
        {
          id: 'driver3',
          name: 'Pierre Express',
          vehicle: 'Voiture',
          rating: 4.7,
          coordinates: [lng + 0.003, lat - 0.001],
          distance: 1.2,
          available: false,
          current_delivery: {
            id: 'delivery1',
            estimated_completion: new Date(Date.now() + 20 * 60 * 1000).toISOString()
          }
        }
      ]

      return new Response(JSON.stringify({ drivers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'delivery-zones':
      const { data: zones, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      return new Response(JSON.stringify({ zones }), {
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
    case 'estimate':
      const pickup = body.pickup
      const delivery = body.delivery
      
      // Calculer la distance et l'estimation
      const distance = calculateDistance(
        pickup[1], pickup[0],
        delivery[1], delivery[0]
      )
      
      const deliveryFee = calculateDeliveryFee(distance)
      const estimatedTime = Math.round(distance * 3) // 3 min par km
      
      const estimate = {
        distance: distance.toFixed(2),
        delivery_fee: deliveryFee,
        estimated_time: estimatedTime,
        estimated_arrival: new Date(Date.now() + estimatedTime * 60 * 1000).toISOString(),
        route: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [pickup, delivery]
          }
        }
      }

      return new Response(JSON.stringify({ estimate }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'assign-delivery':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const delivery = {
        id: crypto.randomUUID(),
        order_id: body.orderId,
        driver_id: body.driverId,
        pickup_address: body.pickup_address,
        pickup_coordinates: body.pickup_coordinates,
        delivery_address: body.delivery_address,
        delivery_coordinates: body.delivery_coordinates,
        status: 'assigned',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('deliveries')
        .insert(delivery)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ delivery: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'update-location':
      const { data: { user: driver } } = await supabase.auth.getUser()
      if (!driver) throw new Error('Unauthorized')

      const locationUpdate = {
        delivery_id: body.deliveryId,
        driver_id: driver.id,
        coordinates: body.location,
        timestamp: new Date().toISOString(),
        status: body.status || 'en_route'
      }

      const { error: locationError } = await supabase
        .from('delivery_locations')
        .upsert(locationUpdate, { onConflict: 'delivery_id' })

      if (locationError) throw locationError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'complete-delivery':
      const { data: { user: deliveryDriver } } = await supabase.auth.getUser()
      if (!deliveryDriver) throw new Error('Unauthorized')

      const { error: completeError } = await supabase
        .from('deliveries')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', body.deliveryId)
        .eq('driver_id', deliveryDriver.id)

      if (completeError) throw completeError

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
  const c = 2 * Math.atan2(Math.sqrt(a), SQRT(1-a));
  return R * c;
}

function calculateDeliveryFee(distance: number): number {
  if (distance <= 2) return 500;
  if (distance <= 5) return 1000;
  if (distance <= 10) return 1500;
  if (distance <= 15) return 2000;
  return 2500; // Distance > 15km
} 