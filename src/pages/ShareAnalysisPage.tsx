import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import FiveElementsChart from '../components/analysis/FiveElementsChart';
import FengShuiRecommendation from '../components/analysis/FengShuiRecommendation';
import EncouragementCard from '../components/shared/EncouragementCard';
import ProductCarousel from '../components/products/ProductCarousel';
import SocialShare from '../components/shared/SocialShare';
import { FengShuiAnalysis, Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ShareAnalysisPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [analysis, setAnalysis] = useState<FengShuiAnalysis | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSnapshots, setProductSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('user_analysis')
          .select('*')
          .eq('uuid', uuid)
          .single();
        if (error || !data) {
          setError('Analysis not found.');
          setLoading(false);
          return;
        }
        setAnalysis({
          elements: data.elements,
          dominantElement: data.dominant_element,
          favorableElements: data.favorable_elements,
          luckyColors: data.lucky_colors,
          recommendations: data.recommendations,
          encouragement: data.encouragement,
        });
        if (data.recommended_products && Array.isArray(data.recommended_products)) {
          setProductSnapshots(data.recommended_products);
        }
        // 拉取推荐产品
        if (!data.recommended_products && data.favorable_elements && data.favorable_elements.length > 0) {
          const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .contains('elements', data.favorable_elements)
            .limit(6);
          setProducts(prodData || []);
        }
      } catch (err) {
        setError('Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchAnalysis();
  }, [uuid]);

  if (loading) {
    return <div className="text-center p-8">Loading analysis...</div>;
  }
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }
  if (!analysis) {
    return <div className="text-center p-8">No analysis found.</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pb-8 pt-6">
      <h1 className="text-2xl font-display font-bold text-center mb-6">Shared Feng Shui Analysis</h1>
      <FiveElementsChart elements={analysis.elements} />
      <EncouragementCard message={analysis.encouragement} />
      <FengShuiRecommendation analysis={analysis} />
      {productSnapshots.length > 0 ? (
        <ProductCarousel products={productSnapshots} title="Recommended for You" />
      ) : products.length > 0 ? (
        <ProductCarousel products={products} title="Recommended for You" />
      ) : null}
      <SocialShare />
    </div>
  );
};

export default ShareAnalysisPage; 