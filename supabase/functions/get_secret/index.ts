import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const { secret_name } = await req.json()
    
    // Vérifier que le nom du secret est valide
    if (!secret_name || typeof secret_name !== 'string') {
      throw new Error('Invalid secret name')
    }

    // Récupérer le secret depuis les variables d'environnement
    const secret = Deno.env.get(secret_name)
    
    if (!secret) {
      throw new Error(`Secret ${secret_name} not found`)
    }

    return new Response(
      JSON.stringify({ secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})