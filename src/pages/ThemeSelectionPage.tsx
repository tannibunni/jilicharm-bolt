import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Briefcase, 
  Coins, 
  Activity,
  Users,
  Home,
  Shield,
  GraduationCap,
  Baby,
  ArrowLeft
} from 'lucide-react';

import { Theme, ThemeType } from '../types';

const ThemeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const themes: Theme[] = [
    {
      id: 'love',
      name: 'Love & Relationships',
      description: 'Improve harmony in your romantic and social connections',
      icon: 'Heart',
    },
    {
      id: 'career',
      name: 'Career & Success',
      description: 'Advance your professional life and achieve your goals',
      icon: 'Briefcase',
    },
    {
      id: 'family',
      name: 'Family & Harmony',
      description: 'Create a balanced and peaceful home environment',
      icon: 'Home',
    },
    {
      id: 'friendship',
      name: 'Friendship & Social Luck',
      description: 'Strengthen bonds and attract positive connections',
      icon: 'Users',
    },
    {
      id: 'health',
      name: 'Health & Vitality',
      description: 'Enhance your physical and mental wellbeing',
      icon: 'Activity',
    },
    {
      id: 'kids',
      name: "Kids' Blessings",
      description: 'Support and nurture children\'s growth and happiness',
      icon: 'Baby',
    },
    {
      id: 'study',
      name: 'Study & Growth',
      description: 'Boost learning and personal development',
      icon: 'GraduationCap',
    },
    {
      id: 'luck',
      name: 'Luck & Protection',
      description: 'Attract good fortune and ward off negative energy',
      icon: 'Shield',
    },
    {
      id: 'wealth',
      name: 'Wealth & Prosperity',
      description: 'Attract abundance and financial stability',
      icon: 'Coins',
    },
  ];
  
  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart size={28} className="text-pink-500" />;
      case 'Briefcase':
        return <Briefcase size={28} className="text-blue-500" />;
      case 'Home':
        return <Home size={28} className="text-amber-500" />;
      case 'Users':
        return <Users size={28} className="text-indigo-500" />;
      case 'Activity':
        return <Activity size={28} className="text-green-500" />;
      case 'Baby':
        return <Baby size={28} className="text-purple-500" />;
      case 'GraduationCap':
        return <GraduationCap size={28} className="text-cyan-500" />;
      case 'Shield':
        return <Shield size={28} className="text-orange-500" />;
      case 'Coins':
        return <Coins size={28} className="text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const handleThemeSelect = (theme: ThemeType) => {
    navigate(`/recommendations/${theme}`);
  };

  const handleBack = () => {
    navigate('/analysis');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={handleBack}
        className="mb-6 flex items-center text-accent-600 hover:text-accent-800 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to Analysis</span>
      </button>

      <h1 className="text-2xl font-display font-semibold text-center mb-2">
        Choose Your Focus Area
      </h1>
      <p className="text-center text-accent-600 mb-8">
        Select an area of life you'd like to enhance with Feng Shui
      </p>
      
      <div className="grid gap-4">
        {themes.map((theme, index) => (
          <motion.button
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className="bg-white/80 backdrop-blur-sm border border-primary-100 hover:bg-white rounded-xl shadow-sm p-4 flex items-start text-left transition-all hover:translate-x-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="bg-primary-50 p-3 rounded-lg mr-4">
              {getThemeIcon(theme.icon)}
            </div>
            <div>
              <h3 className="font-medium text-lg text-accent-800">{theme.name}</h3>
              <p className="text-accent-600 text-sm">{theme.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ThemeSelectionPage;