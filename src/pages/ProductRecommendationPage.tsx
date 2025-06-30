import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ScrollText, CheckCircle2 } from 'lucide-react';

import { useAppContext } from '../contexts/AppContext';
import { getProductsByElementAndTheme } from '../services/productService';
import { ThemeType, Product } from '../types';
import ProductCarousel from '../components/products/ProductCarousel';
import EncouragementCard from '../components/shared/EncouragementCard';
import EmailForm from '../components/shared/EmailForm';
import SocialShare from '../components/shared/SocialShare';

const ProductRecommendationPage: React.FC = () => {
  const { theme } = useParams<{ theme: ThemeType }>();
  const navigate = useNavigate();
  const [themeProducts, setThemeProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [hasShownDiscount, setHasShownDiscount] = useState(false);
  
  const { fengShuiAnalysis } = useAppContext();

  const getThemeEmoji = (themeId: ThemeType): string => {
    const emojis: Record<ThemeType, string> = {
      love: '❤️',
      career: '💼',
      family: '🏠',
      friendship: '🤝',
      health: '🌿',
      kids: '👶',
      study: '📚',
      luck: '🍀',
      wealth: '💰'
    };
    return emojis[themeId] || '✨';
  };

  const getThemeColor = (themeId: ThemeType): string => {
    const colors: Record<ThemeType, string> = {
      love: 'from-pink-500 to-rose-400',
      career: 'from-blue-500 to-indigo-400',
      family: 'from-amber-500 to-orange-400',
      friendship: 'from-indigo-500 to-purple-400',
      health: 'from-green-500 to-emerald-400',
      kids: 'from-purple-500 to-fuchsia-400',
      study: 'from-cyan-500 to-sky-400',
      luck: 'from-orange-500 to-amber-400',
      wealth: 'from-yellow-500 to-amber-400'
    };
    return colors[themeId] || 'from-accent-800 to-accent-700';
  };
  
  const getThemeTitle = (themeId: ThemeType): string => {
    const titles: Record<ThemeType, string> = {
      love: 'Love & Relationships',
      career: 'Career & Success',
      family: 'Family & Harmony',
      friendship: 'Friendship & Social Connections',
      health: 'Health & Vitality',
      kids: "Kids' Blessings",
      study: 'Study & Growth',
      luck: 'Luck & Protection',
      wealth: 'Wealth & Prosperity'
    };
    return titles[themeId] || 'Recommendations';
  };
  
  const getThemeDescription = (themeId: ThemeType): string => {
    const descriptions: Record<ThemeType, string> = {
      love: 'Enhance your relationships and attract harmonious connections through the power of Feng Shui.',
      career: 'Activate your success energy and create an environment that supports your professional growth.',
      family: 'Create a nurturing space that strengthens family bonds and promotes domestic harmony.',
      friendship: 'Cultivate meaningful connections and attract positive social energy into your life.',
      health: 'Balance your space to support vitality, wellness, and overall well-being.',
      kids: 'Design spaces that nurture growth, creativity, and happiness for children.',
      study: 'Optimize your environment for focus, learning, and intellectual development.',
      luck: 'Enhance your fortune and protect your space from negative energies.',
      wealth: 'Attract abundance and create powerful energy flows for financial prosperity.'
    };
    return descriptions[themeId] || '';
  };

  const getFengShuiTips = (themeId: ThemeType): string[] => {
    const tips: Record<ThemeType, string[]> = {
      love: [
        'Place pairs of rose quartz crystals in the southwest corner of your bedroom',
        'Use soft, romantic lighting with pink or red undertones',
        'Keep fresh flowers in your relationship area'
      ],
      career: [
        'Position your desk to face your success direction',
        'Add a small water feature in your work area',
        'Use career-enhancing colors like blue and black'
      ],
      family: [
        'Keep the center of your home clear and well-lit',
        'Display happy family photos in wooden frames',
        'Use earth tones to promote stability'
      ],
      friendship: [
        'Activate your helpful people corner with metal elements',
        'Keep your entrance welcoming and clutter-free',
        'Add circular shapes to promote social harmony'
      ],
      health: [
        'Ensure good air circulation throughout your space',
        'Place air-purifying plants in key locations',
        'Keep your bedroom peaceful and electronics-free'
      ],
      kids: [
        'Create designated play areas with bright, happy colors',
        'Use rounded furniture to ensure safety',
        'Include natural materials in children\'s spaces'
      ],
      study: [
        'Position study desk to face your wisdom direction',
        'Use cool colors to promote concentration',
        'Keep learning spaces organized and clutter-free'
      ],
      luck: [
        'Hang a traditional wind chime near your front door',
        'Place protective symbols in vulnerable areas',
        'Keep your front entrance well-maintained'
      ],
      wealth: [
        'Activate your wealth corner with moving water',
        'Place prosperous plants in your abundance area',
        'Use symbols of abundance mindfully'
      ]
    };
    return tips[themeId] || [];
  };

  const handleBack = () => {
    navigate('/themes');
  };
  
  useEffect(() => {
    const loadThemeProducts = async () => {
      if (!fengShuiAnalysis || !theme) return;
      
      setIsLoading(true);
      try {
        const products = await getProductsByElementAndTheme(
          fengShuiAnalysis.favorableElements,
          theme as ThemeType
        );
        setThemeProducts(products);
      } catch (error) {
        console.error('Error loading theme products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeProducts();
  }, [theme, fengShuiAnalysis]);
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShownDiscount) {
        setShowDiscountModal(true);
        setHasShownDiscount(true);
        // 阻止默认弹窗
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasShownDiscount]);
  
  if (!fengShuiAnalysis) {
    return (
      <div className="text-center p-8">
        <p className="text-accent-600">Please complete your analysis first.</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 离开前弹窗：10%折扣 */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-xs w-full mx-4 p-6 relative animate-fade-in text-center">
            <button
              className="absolute top-2 right-2 text-accent-400 hover:text-accent-700 text-xl"
              onClick={() => setShowDiscountModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-accent-800">Wait! 🎁</h2>
            <p className="text-accent-700 text-lg mb-4">Get <span className="text-primary-600 font-bold">10% OFF</span> your first order!</p>
            <p className="text-accent-600 mb-4 text-sm">Use code <span className="font-mono bg-primary-50 px-2 py-1 rounded">WELCOME10</span> at checkout.</p>
            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-2"
              onClick={() => setShowDiscountModal(false)}
            >
              Claim Discount
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleBack}
        className="mb-6 flex items-center text-accent-600 hover:text-accent-800 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to Themes</span>
      </button>

      {/* Theme Header Section */}
      <div className={`bg-gradient-to-r ${getThemeColor(theme as ThemeType)} rounded-xl p-6 mb-8 text-white shadow-lg`}>
        <div className="text-center">
          <span className="text-4xl mb-4 block">{getThemeEmoji(theme as ThemeType)}</span>
          <h1 className="text-2xl font-display font-semibold mb-2">
            {getThemeTitle(theme as ThemeType)}
          </h1>
          <p className="text-primary-50/90">
            {getThemeDescription(theme as ThemeType)}
          </p>
        </div>
      </div>

      {/* Theme Explanation Box */}
      <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <ScrollText className="w-6 h-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-display text-accent-800">Understanding Your Energy</h2>
        </div>
        <p className="text-accent-700 mb-4">
          Based on your BaZi analysis, your {fengShuiAnalysis.dominantElement} element energy can be enhanced to support your {theme} aspirations. Let's align your space with these powerful forces.
        </p>
        <div className="flex flex-wrap gap-2">
          {fengShuiAnalysis.favorableElements.map((element) => (
            <span
              key={element}
              className="px-3 py-1 bg-primary-50 text-accent-700 rounded-full text-sm font-medium"
            >
              {element}
            </span>
          ))}
        </div>
      </div>

      {/* Feng Shui Tips Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-display text-accent-800">
            Quick Feng Shui Tips
          </h2>
        </div>
        <ul className="space-y-3">
          {getFengShuiTips(theme as ThemeType).map((tip, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
              <span className="text-accent-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Personal Encouragement */}
      <EncouragementCard message={fengShuiAnalysis.encouragement} />

      {/* Product Recommendations */}
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-800 mx-auto mb-4"></div>
          <p className="text-accent-600">Finding the perfect items for you...</p>
        </div>
      ) : (
        <>
          {themeProducts.length > 0 ? (
            <div className="my-8">
              <ProductCarousel 
                products={themeProducts} 
                title="Recommended for Your Space" 
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm border border-primary-100 rounded-lg shadow-sm">
              <p className="text-accent-600">No products found for this theme. Please try another theme.</p>
            </div>
          )}
        </>
      )}

      {/* Email Subscription */}
      <div className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-display text-accent-800 mb-4">
          Get More {getThemeTitle(theme as ThemeType)} Tips
        </h2>
        <p className="text-accent-700 mb-6">
          Subscribe to receive weekly Feng Shui insights specifically for your {theme} aspirations.
        </p>
        <EmailForm />
      </div>
      
      <SocialShare />
    </motion.div>
  );
};

export default ProductRecommendationPage;