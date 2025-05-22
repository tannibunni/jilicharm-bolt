import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import FiveElementsChart from '../components/analysis/FiveElementsChart';
import FengShuiRecommendation from '../components/analysis/FengShuiRecommendation';
import EncouragementCard from '../components/shared/EncouragementCard';
import EmailForm from '../components/shared/EmailForm';
import SocialShare from '../components/shared/SocialShare';
import ProductCarousel from '../components/products/ProductCarousel';
import RotatingTextBanner from '../components/shared/RotatingTextBanner';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    fengShuiAnalysis,
    recommendedProducts,
    isProductsLoading,
  } = useAppContext();

  useEffect(() => {
    if (!fengShuiAnalysis) {
      navigate('/');
    }
    window.scrollTo(0, 0);
  }, [fengShuiAnalysis, navigate]);

  if (!fengShuiAnalysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md mx-auto px-4 sm:px-6 pb-8 pt-6">
        <FiveElementsChart elements={fengShuiAnalysis.elements} />
        
        <EncouragementCard message={fengShuiAnalysis.encouragement} />
        
        <FengShuiRecommendation analysis={fengShuiAnalysis} />
        
        
        
        {!isProductsLoading && recommendedProducts.length > 0 && (
          <ProductCarousel 
            products={recommendedProducts} 
            title="Recommended for You" 
          />
        )}
  <RotatingTextBanner />

        <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-display text-accent-800 mb-4">
            Get Your Full Analysis Report
          </h2>
          <p className="text-accent-700 mb-6">
            Subscribe to receive a detailed Feng Shui report with personalized recommendations.
          </p>
          <EmailForm />
        </div>
        
        <SocialShare />
      </div>
    </motion.div>
  );
};

export default AnalysisPage;