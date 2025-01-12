import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { secret_name } = await req.json()
    
    // Verify that the secret name is valid
    if (!secret_name || typeof secret_name !== 'string') {
      throw new Error('Invalid secret name')
    }

    // Get the secret directly from Deno environment variables
    const secret = Deno.env.get(secret_name)
    
    if (!secret) {
      console.error(`Secret ${secret_name} not found in environment variables`)
      throw new Error(`Secret ${secret_name} not found`)
    }

    console.log(`Successfully retrieved secret: ${secret_name}`)
    
    return new Response(
      JSON.stringify(secret),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get_secret function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})