import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackingRequest {
  trackingNumber: string;
}

interface TrackingResponse {
  trackingNumber: string;
  status: string;
  location: string;
  lastUpdate: string;
  estimatedDelivery: string;
  currentLocation?: [number, number];
  route?: any;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  history: TrackingEvent[];
}

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { trackingNumber }: TrackingRequest = await req.json()

    if (!trackingNumber) {
      throw new Error('Tracking number is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Simulate tracking data (in a real app, this would come from your database)
    const trackingData = await simulateTrackingData(trackingNumber, supabase)

    return new Response(
      JSON.stringify(trackingData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in track delivery:', error)
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

async function simulateTrackingData(trackingNumber: string, supabase: any): Promise<TrackingResponse> {
  // Generate tracking data based on tracking number
  const now = new Date()
  const deliveryDate = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  // Status progression based on tracking number hash
  const hash = trackingNumber.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  const statuses = [
    'En attente de collecte',
    'Collecté',
    'En transit',
    'En cours de livraison',
    'Livré'
  ]

  const currentStatusIndex = Math.abs(hash) % statuses.length
  const currentStatus = statuses[currentStatusIndex]

  // Generate location based on status
  const locations = [
    'Centre de tri, Brazzaville',
    'En route vers Pointe-Noire',
    'Centre de distribution, Pointe-Noire',
    'En cours de livraison',
    'Livré au destinataire'
  ]

  const currentLocation = locations[currentStatusIndex]

  // Generate tracking history
  const history: TrackingEvent[] = []
  const events = [
    { status: 'Commande créée', description: 'Votre commande a été enregistrée' },
    { status: 'En attente de collecte', description: 'En attente de collecte par le livreur' },
    { status: 'Collecté', description: 'Colis collecté par le livreur' },
    { status: 'En transit', description: 'Colis en route vers le centre de distribution' },
    { status: 'En cours de livraison', description: 'Colis en cours de livraison' },
    { status: 'Livré', description: 'Colis livré avec succès' }
  ]

  for (let i = 0; i <= currentStatusIndex; i++) {
    const eventTime = new Date(now.getTime() - (currentStatusIndex - i) * 30 * 60 * 1000)
    history.push({
      timestamp: eventTime.toLocaleString('fr-FR'),
      status: events[i].status,
      location: locations[i] || 'En cours',
      description: events[i].description
    })
  }

  // Generate driver info
  const drivers = [
    { name: 'Jean Livreur', phone: '+242 06 123 4567', vehicle: 'Moto' },
    { name: 'Marie Express', phone: '+242 06 234 5678', vehicle: 'Voiture' },
    { name: 'Pierre Rapide', phone: '+242 06 345 6789', vehicle: 'Camionnette' }
  ]

  const driver = drivers[Math.abs(hash) % drivers.length]

  // Generate current GPS coordinates (simulated)
  const baseCoordinates: [number, number] = [15.2429, -4.2634] // Brazzaville
  const currentCoordinates: [number, number] = [
    baseCoordinates[0] + (Math.random() - 0.5) * 0.1,
    baseCoordinates[1] + (Math.random() - 0.5) * 0.1
  ]

  return {
    trackingNumber,
    status: currentStatus,
    location: currentLocation,
    lastUpdate: now.toLocaleString('fr-FR'),
    estimatedDelivery: deliveryDate.toLocaleString('fr-FR'),
    currentLocation: currentCoordinates,
    driver,
    history
  }
} 