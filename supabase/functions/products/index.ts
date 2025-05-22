import { createClient } from 'npm:@supabase/supabase-js@2';
import { ElementType, ThemeType } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const elements = url.searchParams.get('elements')?.split(',') as ElementType[];
    const theme = url.searchParams.get('theme') as ThemeType;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    let query = supabase
      .from('products')
      .select('*');

    if (elements?.length) {
      query = query.contains('elements', elements);
    }

    if (theme) {
      query = query.contains('themes', [theme]);
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(products),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});