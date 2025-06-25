import axios from 'axios';
import { FengShuiAnalysis, Product, ElementType, ThemeType } from '../types';
import { createClient } from '@supabase/supabase-js';

// Add type declaration for import.meta.env
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 自动切换 API 地址
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : ''; // 生产环境使用相对路径，指向Netlify Functions

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
    const requestData = {
      date,
      time,
      location: location || 'Washington DC'
    };
    
    console.log('Making API request to:', `${API_BASE_URL}/api/analyze`);
    console.log('Request data:', requestData);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/analyze`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('API response received:', response.data);
    console.log('Response structure:', {
      hasChoices: !!response.data.choices,
      choicesLength: response.data.choices?.length,
      hasMessage: !!response.data.choices?.[0]?.message,
      hasContent: !!response.data.choices?.[0]?.message?.content
    });

    let result = response.data.choices[0].message.content;
    
    // Remove any markdown formatting or backticks
    result = result.replace(/```json\n|```/g, '').trim();
    // 用正则提取第一个大括号包裹的 JSON
    const braceMatch = result.match(/{[\s\S]*}/);
    if (braceMatch) {
      result = braceMatch[0];
    }
    // 打印原始内容便于调试
    console.log('Raw result to parse:', result);
    
    try {
      // 尝试修复常见的 JSON 问题
      result = result.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rhnybtlxyhydkcvwhits.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobnlidGx4eWh5ZGtjdndoaXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjY0NDMsImV4cCI6MjA2MTM0MjQ0M30.0GltOLyw8q4Pbg0o9OGvaGLD4L_SmqGz8-OJ410lX-g';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

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

    return data;
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get product recommendations');
  }
};

export const saveUserEmail = async (email: string): Promise<void> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rhnybtlxyhydkcvwhits.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobnlidGx4eWh5ZGtjdndoaXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjY0NDMsImV4cCI6MjA2MTM0MjQ0M30.0GltOLyw8q4Pbg0o9OGvaGLD4L_SmqGz8-OJ410lX-g';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase
      .from('user_emails')
      .insert([
        { 
          email,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error saving email:', error);
      throw new Error('Failed to save email');
    }

    console.log('Email saved successfully');
  } catch (error) {
    console.error('Error saving user email:', error);
    throw error;
  }
};
