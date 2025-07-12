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
    // Create Supabase client
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
      case 'PUT':
        return await handlePut(path, req, supabaseClient)
      case 'DELETE':
        return await handleDelete(path, url, supabaseClient)
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

// GET endpoints
async function handleGet(path: string, url: URL, supabase: any) {
  const { searchParams } = url

  switch (path) {
    case 'nearby-restaurants':
      const lat = parseFloat(searchParams.get('lat') || '0')
      const lng = parseFloat(searchParams.get('lng') || '0')
      const radius = parseFloat(searchParams.get('radius') || '5')
      
      const { data: restaurants, error } = await supabase
        .rpc('find_nearby_restaurants', {
          user_lat: lat,
          user_lon: lng,
          radius_km: radius
        })

      if (error) throw error

      return new Response(JSON.stringify({ restaurants }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'delivery-zones':
      const { data: zones, error: zonesError } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)

      if (zonesError) throw zonesError

      return new Response(JSON.stringify({ zones }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'user-locations':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: locations, error: locationsError } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (locationsError) throw locationsError

      return new Response(JSON.stringify({ locations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'delivery-zone':
      const userLat = parseFloat(searchParams.get('lat') || '0')
      const userLng = parseFloat(searchParams.get('lng') || '0')
      
      const { data: zone, error: zoneError } = await supabase
        .rpc('get_delivery_zone', {
          lat: userLat,
          lon: userLng
        })

      if (zoneError) throw zoneError

      return new Response(JSON.stringify({ zone: zone[0] || null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

// POST endpoints
async function handlePost(path: string, req: Request, supabase: any) {
  const body = await req.json()

  switch (path) {
    case 'save-location':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: location, error } = await supabase
        .from('user_locations')
        .insert({
          user_id: user.id,
          name: body.name,
          address: body.address,
          latitude: body.coordinates[1],
          longitude: body.coordinates[0],
          type: body.type
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ location }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'geocode':
      // Utiliser l'API Mapbox pour le géocodage
      const mapboxToken = Deno.env.get('MAPBOX_TOKEN')
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(body.address)}.json?access_token=${mapboxToken}&country=CG&limit=1`
      )
      
      const geocodeData = await response.json()
      
      if (geocodeData.features && geocodeData.features.length > 0) {
        const feature = geocodeData.features[0]
        const [lng, lat] = feature.center
        
        return new Response(JSON.stringify({
          coordinates: [lng, lat],
          address: feature.place_name,
          formatted_address: feature.place_name
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        return new Response(JSON.stringify({ error: 'Address not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

    case 'reverse-geocode':
      const mapboxTokenReverse = Deno.env.get('MAPBOX_TOKEN')
      const [lng, lat] = body.coordinates
      
      const reverseResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxTokenReverse}&country=CG&limit=1`
      )
      
      const reverseData = await reverseResponse.json()
      
      if (reverseData.features && reverseData.features.length > 0) {
        const feature = reverseData.features[0]
        
        return new Response(JSON.stringify({
          address: feature.place_name,
          formatted_address: feature.place_name,
          coordinates: [lng, lat]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        return new Response(JSON.stringify({ error: 'Coordinates not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

// PUT endpoints
async function handlePut(path: string, req: Request, supabase: any) {
  const body = await req.json()

  switch (path) {
    case 'update-location':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: location, error } = await supabase
        .from('user_locations')
        .update({
          name: body.name,
          address: body.address,
          latitude: body.coordinates[1],
          longitude: body.coordinates[0],
          type: body.type
        })
        .eq('id', body.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ location }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

// DELETE endpoints
async function handleDelete(path: string, url: URL, supabase: any) {
  const { searchParams } = url

  switch (path) {
    case 'delete-location':
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const locationId = searchParams.get('id')
      if (!locationId) throw new Error('Location ID required')

      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', locationId)
        .eq('user_id', user.id)

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