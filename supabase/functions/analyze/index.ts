import { createClient } from 'npm:@supabase/supabase-js@2';
import { ElementType, FengShuiAnalysis } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AnalysisRequest {
  date: string;
  time: string;
  location: string;
  name?: string;
}

async function analyzeBirthData(data: AnalysisRequest): Promise<FengShuiAnalysis> {
  const response = await fetch(`${Deno.env.get('DEEPSEEK_URL')}/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      birth_date: data.date,
      birth_time: data.time,
      birth_location: data.location,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze birth data');
  }

  const result = await response.json();
  return result;
}

async function saveAnalysis(analysis: FengShuiAnalysis, userId: string, requestData: AnalysisRequest) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  const { error } = await supabase
    .from('user_analyses')
    .insert({
      user_id: userId,
      birth_date: requestData.date,
      birth_time: requestData.time,
      birth_location: requestData.location,
      name: requestData.name,
      elements: analysis.elements,
      dominant_element: analysis.dominantElement,
      favorable_elements: analysis.favorableElements,
      recommendations: analysis.recommendations,
    });

  if (error) {
    throw new Error('Failed to save analysis');
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const requestData: AnalysisRequest = await req.json();
    const analysis = await analyzeBirthData(requestData);
    await saveAnalysis(analysis, user.id, requestData);

    return new Response(
      JSON.stringify(analysis),
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
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});