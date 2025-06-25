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
  const DEEPSEEK_BASE_URL = Deno.env.get('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com';
  const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
  
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const payload = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `You are a professional BaZi (Four Pillars of Destiny) and Feng Shui consultant. Analyze the user's birth info and return ONLY a valid JSON object with English fields, structured exactly as shown below. Do NOT include any explanation, markdown, code block, or any text before or after the JSON. Output ONLY the JSON object, nothing else.

{
  "elements": { "wood": 2, "fire": 3, "earth": 1, "metal": 0, "water": 4 },
  "dominantElement": "fire",
  "favorableElements": ["water", "wood"],
  "luckyColors": ["blue", "green"],
  "recommendations": ["Put a water fountain in the north corner.", "Wear metal accessories.", "Add wood elements in the east.", "Avoid strong fire elements"],
  "encouragement": "Let your creativity flow like water."
}`
      },
      {
        role: 'user',
        content: `Birth Date: ${data.date}\nBirth Time: ${data.time}\nBirth Location: ${data.location}`
      }
    ],
    temperature: 0.2
  };

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  // 解析 AI 返回的内容
  let content = result.choices[0].message.content;
  
  // 清理 JSON 内容
  content = content.replace(/```json\n|```/g, '').trim();
  const braceMatch = content.match(/{[\s\S]*}/);
  if (braceMatch) {
    content = braceMatch[0];
  }
  
  // 修复常见的 JSON 问题
  content = content.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  
  try {
    const analysis = JSON.parse(content);
    return analysis;
  } catch (parseError) {
    throw new Error(`Failed to parse AI response: ${parseError.message}`);
  }
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
    const requestData: AnalysisRequest = await req.json();
    const analysis = await analyzeBirthData(requestData);
    
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
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});