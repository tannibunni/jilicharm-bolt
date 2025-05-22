import axios from 'axios';
import { FengShuiAnalysis, Product, ElementType, ThemeType } from '../types';
import { createClient } from '@supabase/supabase-js';

// Add type declaration for import.meta.env
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_DEEPSEEK_BASE_URL: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const analyzeBirthInfo = async (
  date: string,
  time: string,
  location: string,
  isTimeUnsure?: boolean
): Promise<FengShuiAnalysis> => {
  const prompt = `Please analyze the following birth information using Chinese BaZi and Five Elements principles, and return ONLY a valid JSON object with English fields, structured exactly as shown below, without any additional text:

{
  "elements": { "wood": 2, "fire": 3, "earth": 1, "metal": 0, "water": 4 },
  "dominantElement": "fire",
  "favorableElements": ["water", "wood"],
  "luckyColors": ["blue", "green"],
  "recommendations": ["Put a water fountain in the north corner.", "Wear metal accessories.", "Add wood elements in the east.", "Avoid strong fire elements"],
  "encouragement": "Let your creativity flow like water."
}

Birth Date: ${date}
Birth Time: ${isTimeUnsure ? 'unknown' : time}
Birth Location: ${location || 'unknown'}`;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_DEEPSEEK_BASE_URL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let result = response.data.choices[0].message.content;
    
    // Remove any markdown formatting or backticks
    result = result.replace(/```json\n|\n```/g, '').trim();
    
    try {
      const analysis = JSON.parse(result);

      // Map Chinese field names to English
      const elementMapping: Record<string, ElementType> = {
        '木': 'wood',
        '火': 'fire',
        '土': 'earth',
        '金': 'metal',
        '水': 'water',
        'wood': 'wood',
        'fire': 'fire',
        'earth': 'earth',
        'metal': 'metal',
        'water': 'water'
      };

      // Transform the elements object
      const elements: Record<ElementType, number> = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0
      };

      // Handle different possible element field names
      const rawElements = analysis.elements || analysis.五行比例 || analysis.五行;
      if (rawElements) {
        Object.entries(rawElements).forEach(([key, value]) => {
          const englishElement = elementMapping[key];
          if (englishElement) {
            elements[englishElement] = Number(value);
          }
        });
      }

      // Map the dominant element
      const dominantElement = elementMapping[analysis.dominantElement || analysis.最强五行 || analysis.dominant_element];
      if (!dominantElement) {
        throw new Error('Missing dominant element in analysis');
      }

      // Map favorable elements
      const rawFavorableElements = analysis.favorableElements || analysis.喜用神 || analysis.favorable_elements || [];
      const favorableElements = Array.isArray(rawFavorableElements) 
        ? rawFavorableElements.map(el => elementMapping[el]).filter(Boolean) as ElementType[]
        : [elementMapping[rawFavorableElements]].filter(Boolean) as ElementType[];

      // Map lucky colors
      const luckyColors = analysis.luckyColors || analysis.适合颜色 || analysis.lucky_colors || [];

      // Map recommendations
      const recommendations = analysis.recommendations || analysis.建议 || [];
      if (analysis.禁忌) {
        recommendations.push(analysis.禁忌);
      }

      // Map encouragement
      const encouragement = analysis.encouragement || analysis.鼓励语 || '';

      const fengShuiAnalysis: FengShuiAnalysis = {
        elements,
        dominantElement,
        favorableElements,
        luckyColors: Array.isArray(luckyColors) ? luckyColors : [luckyColors],
        recommendations: Array.isArray(recommendations) ? recommendations : [recommendations],
        encouragement
      };

      // Validate the required fields
      if (!fengShuiAnalysis.elements || 
          !fengShuiAnalysis.dominantElement || 
          !fengShuiAnalysis.favorableElements || 
          !fengShuiAnalysis.recommendations) {
        throw new Error('Invalid analysis response structure');
      }

      return fengShuiAnalysis;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Raw API response:', result);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error analyzing birth info:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze birth information');
  }
};

export const getProductRecommendations = async (
  favorableElements: ElementType[],
  theme?: ThemeType
): Promise<Product[]> => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    let query = supabase
      .from('products')
      .select('*')
      .limit(6);

    // Filter by favorable elements
    if (favorableElements.length > 0) {
      query = query.contains('elements', favorableElements);
    }

    // Filter by theme if provided
    if (theme) {
      query = query.contains('themes', [theme]);
    }

    // Order by title
    query = query.order('title');

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match the Product interface
    return data.map((item: {
      id: number;
      title: string;
      description: string;
      image_url: string;
      shopify_url: string;
      price: number;
      compare_at_price?: number;
      elements: string[];
      themes: string[];
    }) => ({
      id: item.id.toString(),
      name: item.title,
      description: item.description,
      imageUrl: item.image_url,
      shopifyUrl: item.shopify_url,
      price: `$${item.price.toFixed(2)}`,
      originalPrice: item.compare_at_price ? `$${item.compare_at_price.toFixed(2)}` : undefined,
      onSale: item.compare_at_price ? item.compare_at_price > item.price : false,
      elements: item.elements as ElementType[],
      themes: item.themes as ThemeType[]
    }));
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};

export const saveUserEmail = async (email: string): Promise<boolean> => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const { error } = await supabase
    .from('emails')
    .insert([{ email }]);

  if (error) {
    console.error('Error saving email:', error);
    return false;
  }
  return true;
};

export async function getRecommendedProducts(
  favorableElements: string[],
  theme?: string
): Promise<Product[]> {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    let query = supabase
      .from('products')
      .select('*')
      .limit(6);

    // Filter by favorable elements
    if (favorableElements.length > 0) {
      query = query.contains('element', favorableElements);
    }

    // Filter by theme if provided
    if (theme) {
      query = query.ilike('luck', `%${theme}%`);
    }

    // Order by title
    query = query.order('title');

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match the Product interface
    return data.map((item: {
      id: number;
      title: string;
      recommendation: string;
      image_url: string;
      shopify_url: string;
      price: number;
      compare_at_price?: number;
      element: string;
      luck: string;
    }) => ({
      id: item.id.toString(),
      name: item.title,
      description: item.recommendation,
      imageUrl: item.image_url,
      shopifyUrl: item.shopify_url,
      price: `$${item.price.toFixed(2)}`,
      originalPrice: item.compare_at_price ? `$${item.compare_at_price.toFixed(2)}` : undefined,
      onSale: item.compare_at_price ? item.compare_at_price > item.price : false,
      elements: [item.element as ElementType],
      themes: [item.luck.toLowerCase() as ThemeType]
    }));
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
}