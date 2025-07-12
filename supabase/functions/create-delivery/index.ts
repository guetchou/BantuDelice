import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateDeliveryRequest {
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  serviceId: string;
  insurance: boolean;
  tracking: boolean;
  specialInstructions: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  estimatedCost: number;
  estimatedDistance: number;
  estimatedTime: number;
  userId?: string;
}

interface CreateDeliveryResponse {
  success: boolean;
  trackingNumber: string;
  deliveryId: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const deliveryData: CreateDeliveryRequest = await req.json()

    // Validate required fields
    if (!deliveryData.pickupAddress || !deliveryData.deliveryAddress) {
      throw new Error('Pickup and delivery addresses are required')
    }

    if (!deliveryData.contactInfo.name || !deliveryData.contactInfo.phone) {
      throw new Error('Contact information is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate tracking number
    const trackingNumber = 'BUNT-' + Math.random().toString(36).substr(2, 8).toUpperCase()

    // Create delivery record in database
    const { data: delivery, error } = await supabase
      .from('deliveries')
      .insert({
        tracking_number: trackingNumber,
        user_id: deliveryData.userId || 'anonymous',
        pickup_address: deliveryData.pickupAddress,
        delivery_address: deliveryData.deliveryAddress,
        package_type: deliveryData.packageType,
        weight: deliveryData.weight,
        dimensions: deliveryData.dimensions,
        service_id: deliveryData.serviceId,
        insurance: deliveryData.insurance,
        tracking: deliveryData.tracking,
        special_instructions: deliveryData.specialInstructions,
        contact_name: deliveryData.contactInfo.name,
        contact_phone: deliveryData.contactInfo.phone,
        contact_email: deliveryData.contactInfo.email,
        estimated_cost: deliveryData.estimatedCost,
        estimated_distance: deliveryData.estimatedDistance,
        estimated_time: deliveryData.estimatedTime,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to create delivery record')
    }

    // Create initial tracking event
    await supabase
      .from('delivery_tracking')
      .insert({
        delivery_id: delivery.id,
        tracking_number: trackingNumber,
        status: 'Commande créée',
        location: 'Centre de traitement',
        description: 'Votre commande a été enregistrée et est en cours de traitement',
        timestamp: new Date().toISOString()
      })

    const response: CreateDeliveryResponse = {
      success: true,
      trackingNumber,
      deliveryId: delivery.id,
      message: 'Delivery request created successfully'
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in create delivery:', error)
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