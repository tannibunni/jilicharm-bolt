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
    userBirthInfo,
    userEmail,
  } = useAppContext();
  const [shareId, setShareId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = localStorage.getItem('shareId');
    if (id) setShareId(id);
  }, []);

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
        
        {/* Navigation block to go back to theme selection */}
        <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-display text-accent-800 mb-3">
            Want to Try a Different Theme?
          </h3>
          <p className="text-accent-700 mb-4">
            Explore other Feng Shui themes and get new personalized recommendations.
          </p>
          <button
            onClick={() => navigate('/themes')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Choose Different Theme
          </button>
        </div>
        
        {!isProductsLoading && recommendedProducts.length > 0 && (
          <ProductCarousel 
            products={recommendedProducts} 
            title="Recommended for You" 
          />
        )}
        
        <div className="mb-6">
          <RotatingTextBanner />
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-display text-accent-800 mb-4">
            Get Your Full Analysis Report
          </h2>
          <p className="text-accent-700 mb-6">
            Subscribe to receive a detailed Feng Shui report with personalized recommendations.
          </p>
          <EmailForm />
        </div>
        
        <SocialShare url={shareId ? `${window.location.origin}/share/${shareId}` : window.location.href} />
      </div>
    </motion.div>
  );
};

export default AnalysisPage;