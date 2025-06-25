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

// 使用 Supabase Edge Functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const analyzeBirthInfo = async (
  date: string,
  time: string,
  location: string,
  isTimeUnsure?: boolean
): Promise<FengShuiAnalysis> => {
  try {
    const requestData = {
      date,
      time,
      location: location || 'Washington DC'
    };
    
    console.log('Making API request to Supabase Edge Function');
    console.log('Request data:', requestData);
    
    // 创建 Supabase 客户端
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 调用 Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze', {
      body: requestData
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }

    console.log('Analysis result:', data);
    
    // 验证返回的数据结构
    if (!data || !data.elements || !data.dominantElement || !data.favorableElements) {
      throw new Error('Invalid analysis response structure');
    }

    return data as FengShuiAnalysis;
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
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

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
