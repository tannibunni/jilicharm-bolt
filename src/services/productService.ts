import { createClient } from '@supabase/supabase-js';
import { Product, ElementType, ThemeType } from '../types';

// Add type declaration for import.meta.env
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Define the raw product type from Supabase
interface SupabaseProduct {
  id: number;
  title: string;
  description: string;
  image_url: string;
  shopify_url: string;
  price: number;
  compare_at_price?: number;
  elements: string[];
  themes: string[];
}

// Helper function to transform Supabase product to our Product type
function transformProduct(item: SupabaseProduct): Product {
  return {
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
  };
}

// Helper function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment variables check:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'NOT SET');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'NOT SET');
  console.log('Creating Supabase client with:', {
    url: supabaseUrl,
    keyLength: supabaseKey?.length
  });
  
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL environment variable is not set');
  }
  
  if (!supabaseKey) {
    throw new Error('VITE_SUPABASE_ANON_KEY environment variable is not set');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
}

// Test function to check database connection
export async function testDatabaseConnection(): Promise<void> {
  const supabase = createSupabaseClient();
  
  try {
    console.log('Testing database connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection error:', error);
      throw error;
    }
    
    console.log('Successfully connected to database');
    console.log('Total products in database:', count);
  } catch (error) {
    console.error('Error testing database connection:', error);
    throw error;
  }
}

/**
 * Get products that match the user's favorable elements
 * Used in AnalysisPage.tsx
 */
export async function getProductsByElement(
  favorableElements: string[]
): Promise<Product[]> {
  const supabase = createSupabaseClient();

  try {
    console.log('Fetching products with elements:', favorableElements);
    
    // First, let's see what products we have in the database
    const { data: allProducts, error: countError } = await supabase
      .from('products')
      .select('elements');
    
    if (countError) {
      console.error('Error fetching all products:', countError);
    } else {
      console.log('Sample of products in database:', allProducts?.slice(0, 5));
    }
    
    // Convert elements to lowercase for case-insensitive comparison
    const normalizedElements = favorableElements.map(e => e.toLowerCase());
    
    // Use a simpler query with OR conditions
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(normalizedElements.map(element => `elements.cs.{${element}}`).join(','))
      .limit(10)
      .order('title');

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!data) {
      console.log('No products found');
      return [];
    }

    console.log('Found products:', data.length);
    if (data.length > 0) {
      console.log('First product elements:', data[0].elements);
    }
    return data.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products by element:', error);
    throw error;
  }
}

/**
 * Get products that match both favorable elements and theme
 * Used in ProductRecommendationPage.tsx
 */
export async function getProductsByElementAndTheme(
  favorableElements: string[],
  theme: string
): Promise<Product[]> {
  const supabase = createSupabaseClient();

  try {
    console.log('Fetching products with elements:', favorableElements, 'and theme:', theme);
    
    // Convert elements and theme to lowercase for case-insensitive comparison
    const normalizedElements = favorableElements.map(e => e.toLowerCase());
    const normalizedTheme = theme.toLowerCase();
    
    // Use a simpler query with OR conditions for elements and AND for theme
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(normalizedElements.map(element => `elements.cs.{${element}}`).join(','))
      .filter('themes', 'cs', `{${normalizedTheme}}`)
      .limit(10)
      .order('title');

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }

    if (!data) {
      console.log('No products found');
      return [];
    }

    console.log('Found products:', data.length);
    if (data.length > 0) {
      console.log('First product elements:', data[0].elements);
      console.log('First product themes:', data[0].themes);
    }
    return data.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products by element and theme:', error);
    throw error;
  }
}

// Helper function to list all products
export async function listAllProducts(): Promise<void> {
  const supabase = createSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, elements, themes')
      .order('id');

    if (error) {
      console.error('Error listing products:', error);
      return;
    }

    console.log('All products in database:');
    data?.forEach(product => {
      console.log(`ID: ${product.id}, Title: ${product.title}, Elements: ${product.elements}, Themes: ${product.themes}`);
    });
  } catch (error) {
    console.error('Error listing products:', error);
  }
} 