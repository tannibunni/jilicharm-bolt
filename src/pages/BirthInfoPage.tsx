import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, HelpCircle } from 'lucide-react';
import logo from '../assets/logo-jilicharm-fengshui.png';
import RotatingTextBanner from '../components/shared/RotatingTextBanner';

import { useAppContext } from '../contexts/AppContext';
import { analyzeBirthInfo } from '../services/apiService';
import { getProductsByElement, testDatabaseConnection, listAllProducts } from '../services/productService';
import CustomDatePicker from '../components/shared/CustomDatePicker';

interface FormData {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  isTimeUnsure: boolean;
}

const introMessages = [
  "Find out which energies shape your life and luck",
  "Personalized Feng Shui insights based on your birth info",
  "Get practical tips to boost your well-being, career, and relationships",
  "Discover your lucky colors and elements",
  "No prior Feng Shui knowledge needed—just enter your birth details!"
];

// 简单Modal组件
const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded-xl shadow-lg max-w-xs w-full mx-4 p-6 relative animate-fade-in">
      {children}
    </div>
  </div>
);

const fengShuiTips = [
  "Keep your entryway clear to welcome positive energy.",
  "Add a plant to your workspace for growth and vitality.",
  "Mirrors can expand light and energy—place them wisely!",
  "Declutter your space to let good fortune flow.",
  "Use the color green to boost health and renewal.",
  "A bowl of oranges in the kitchen attracts abundance.",
  "Let natural light in to energize your home.",
  "Place your bed where you can see the door for restful sleep.",
  "Water features can enhance wealth energy—keep them clean.",
  "Balance the five elements in your decor for harmony."
];

const BirthInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [showTimeHelp, setShowTimeHelp] = useState(false);
  
  const { 
    setUserBirthInfo,
    setFengShuiAnalysis,
    setRecommendedProducts,
    setIsAnalysisLoading,
    setIsProductsLoading,
    isAnalysisLoading,
    error,
    setError
  } = useAppContext();
  
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      birthDate: new Date().toISOString().split('T')[0],
      birthTime: '',
      birthLocation: '',
      isTimeUnsure: false
    }
  });

  const isTimeUnsure = watch('isTimeUnsure');
  const birthDate = watch('birthDate');
  
  // 随机选一个风水tip
  const [tipIndex] = useState(() => Math.floor(Math.random() * fengShuiTips.length));
  
  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsAnalysisLoading(true);
      
      // Test database connection first
      await testDatabaseConnection();
      
      // List all products to identify test products
      await listAllProducts();
      
      const timeToUse = data.isTimeUnsure ? '12:00' : data.birthTime;
      
      setUserBirthInfo({
        date: data.birthDate,
        time: timeToUse,
        location: data.birthLocation || '',
      });

      // First attempt the analysis
      const analysis = await analyzeBirthInfo(
        data.birthDate,
        timeToUse,
        data.birthLocation || '',
        data.isTimeUnsure
      );

      // Validate the analysis response
      if (!analysis || !analysis.elements || !analysis.dominantElement || !analysis.favorableElements) {
        throw new Error('Invalid analysis response format');
      }

      setFengShuiAnalysis(analysis);
      
      // Only proceed with product recommendations if analysis was successful
      setIsProductsLoading(true);
      const products = await getProductsByElement(analysis.favorableElements);
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid products response format');
      }
      
      setRecommendedProducts(products);
      navigate('/analysis');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err instanceof Error 
          ? err.message
          : 'Failed to analyze birth information. Please try again.'
      );
    } finally {
      setIsAnalysisLoading(false);
      setIsProductsLoading(false);
    }
  };

  const handleTimeUnsureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue('isTimeUnsure', checked);
    if (checked) {
      setValue('birthTime', '12:00');
    }
  };

  const handleDateChange = (date: string) => {
    setValue('birthDate', date);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-sm mx-auto"
    >
      <a href="https://jilicharm.com/" target="_blank" rel="noopener noreferrer">
        <img
          src={logo}
          alt="JILI Charm Logo"
          className="mx-auto mb-6 w-32 h-auto"
        />
      </a>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-accent-900 mb-2">Discover Your Energy Map
        </h1>
        <div className="text-accent-700 text-base mb-2">
        Personalized Feng Shui analysis tailored to your space
        </div>
        <div className="text-accent-500 text-sm">
          Quick, private, no sign-up
        </div>
        <div className="text-accent-500 text-sm">
        Trusted by 10,000+
        </div>
       
      </div>
      <motion.div
        className="bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm p-6 mb-8"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="flex items-center mb-2 text-accent-700 font-medium">
              <CalendarClock size={18} className="mr-2 text-accent-800" />
              Date of Birth
            </label>
            <CustomDatePicker
              value={birthDate}
              onChange={handleDateChange}
              error={errors.birthDate?.message}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-accent-700 font-medium">
                <CalendarClock size={18} className="mr-2 text-accent-800" />
                Time of Birth
              </label>
              <button
                type="button"
                onClick={() => setShowTimeHelp(!showTimeHelp)}
                className="text-accent-600 hover:text-accent-800"
              >
                <HelpCircle size={16} />
              </button>
            </div>
            
            {showTimeHelp && (
              <div className="mb-2 p-3 bg-primary-50 rounded-lg text-sm text-accent-600">
                Don't know the exact time? No problem — we'll use noon as a placeholder so you still get an accurate reading.
              </div>
            )}
            
            <input
              type="time"
              className={`w-full px-4 py-3 rounded-lg bg-primary-50 border ${
                errors.birthTime ? 'border-red-300' : 'border-primary-200'
              } focus:outline-none focus:ring-2 focus:ring-accent-800/20 ${
                isTimeUnsure ? 'opacity-50' : ''
              } mb-2`}
              {...register('birthTime', { 
                required: !isTimeUnsure && 'Birth time is required' 
              })}
              disabled={isTimeUnsure}
            />
            
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-primary-200"
                {...register('isTimeUnsure')}
                onChange={handleTimeUnsureChange}
              />
              <span className="ml-2 text-sm text-accent-600">
                I'm not sure about the exact time
              </span>
            </label>
            
            {isTimeUnsure && (
              <p className="mt-2 text-accent-600 text-xs italic">
                Note: Without an exact birth time, the analysis may have slight variations
              </p>
            )}
          </div>
          
          <div>
            <label className="flex items-center mb-2 text-accent-700 font-medium">
              <MapPin size={18} className="mr-2 text-accent-800" />
              Birth Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., New York, USA"
              className={`w-full px-4 py-3 rounded-lg bg-primary-50 border border-primary-200 
                focus:outline-none focus:ring-2 focus:ring-accent-800/20 placeholder-accent-400`}
              {...register('birthLocation')}
            />
          </div>
          
          <button
            type="submit"
            disabled={isAnalysisLoading}
            className="w-full bg-[#CF6E68] hover:bg-[#B85F59] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-[#E5A6A2] shadow-sm"
          >
            {isAnalysisLoading ? 'Analyzing...' : 'Analyze My Elements'}
          </button>
        </form>
      </motion.div>
      
      {/* 优化后的分析加载弹窗+风水tips */}
      {isAnalysisLoading && (
        <Modal>
          <div className="flex flex-col items-center p-2">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-800 mb-4"></div>
            <h2 className="text-lg font-bold mb-2 text-accent-900">Analyzing your energy map...</h2>
            <div className="text-accent-700 mb-2 text-sm">Here's a Feng Shui tip while you wait:</div>
            <div className="bg-primary-50 rounded-lg p-3 text-accent-800 text-center font-medium text-base shadow-sm">
              {Array.isArray(fengShuiTips) && fengShuiTips.length > 0 ? (fengShuiTips[tipIndex % fengShuiTips.length] || 'Welcome to your Feng Shui journey!') : 'Welcome to your Feng Shui journey!'}
            </div>
          </div>
        </Modal>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Try Again
          </button>
        </div>
      )}
      
     
    </motion.div>
  );
};

export default BirthInfoPage;