import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { secret_name } = await req.json()
    
    // Verify that the secret name is valid
    if (!secret_name || typeof secret_name !== 'string') {
      throw new Error('Invalid secret name')
    }

    // Get the secret directly from environment variables
    const secret = Deno.env.get(secret_name)
    
    if (!secret) {
      throw new Error(`Secret ${secret_name} not found`)
    }

    // Return the secret value directly
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