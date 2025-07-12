import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeliveryEstimateRequest {
  pickupCoordinates: [number, number]; // [lng, lat]
  deliveryCoordinates: [number, number]; // [lng, lat]
  packageType?: string;
  weight?: number;
  serviceType?: string;
}

interface DeliveryEstimateResponse {
  distance: number; // km
  duration: number; // minutes
  additionalCost: number; // FCFA
  route: any;
  estimatedDeliveryTime: string;
  serviceRecommendations: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pickupCoordinates, deliveryCoordinates, packageType = 'standard', weight = 1, serviceType = 'standard' }: DeliveryEstimateRequest = await req.json()

    // Validate coordinates
    if (!pickupCoordinates || !deliveryCoordinates) {
      throw new Error('Coordinates are required')
    }

    // Get Mapbox access token from environment
    const mapboxToken = Deno.env.get('MAPBOX_SK')
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured')
    }

    // Calculate distance and route using Mapbox Directions API
    const pickupStr = `${pickupCoordinates[0]},${pickupCoordinates[1]}`
    const deliveryStr = `${deliveryCoordinates[0]},${deliveryCoordinates[1]}`
    
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupStr};${deliveryStr}?access_token=${mapboxToken}&overview=full&geometries=geojson`

    const directionsResponse = await fetch(directionsUrl)
    const directionsData = await directionsResponse.json()

    if (!directionsResponse.ok) {
      throw new Error(`Mapbox API error: ${directionsData.message}`)
    }

    const route = directionsData.routes[0]
    const distanceKm = route.distance / 1000 // Convert meters to kilometers
    const durationMinutes = Math.round(route.duration / 60) // Convert seconds to minutes

    // Calculate additional costs based on distance and package type
    let additionalCost = 0
    const baseRate = 100 // FCFA per km
    const distanceCost = distanceKm * baseRate

    // Package type multipliers
    const packageMultipliers = {
      'standard': 1,
      'fragile': 1.5,
      'heavy': 2,
      'refrigerated': 2.5,
      'documents': 0.8
    }

    const packageMultiplier = packageMultipliers[packageType] || 1
    additionalCost = distanceCost * packageMultiplier

    // Weight surcharge
    if (weight > 5) {
      additionalCost += (weight - 5) * 200 // 200 FCFA per kg over 5kg
    }

    // Service type adjustments
    const serviceAdjustments = {
      'express': 2.5,
      'standard': 1,
      'economy': 0.7
    }

    const serviceMultiplier = serviceAdjustments[serviceType] || 1
    additionalCost *= serviceMultiplier

    // Generate service recommendations
    const recommendations = []
    if (distanceKm > 50) {
      recommendations.push('Service express recommandé pour les longues distances')
    }
    if (packageType === 'fragile') {
      recommendations.push('Assurance supplémentaire recommandée')
    }
    if (weight > 10) {
      recommendations.push('Service spécialisé recommandé pour les colis lourds')
    }

    // Estimate delivery time
    const now = new Date()
    const estimatedDeliveryTime = new Date(now.getTime() + durationMinutes * 60 * 1000)
    const deliveryTimeString = estimatedDeliveryTime.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const response: DeliveryEstimateResponse = {
      distance: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
      duration: durationMinutes,
      additionalCost: Math.round(additionalCost),
      route: route.geometry,
      estimatedDeliveryTime: deliveryTimeString,
      serviceRecommendations: recommendations
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in delivery estimate:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 