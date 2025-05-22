import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FiveElements, FengShuiAnalysis, Product } from '../types';

interface AppContextProps {
  userBirthInfo: {
    date: string;
    time: string;
    location: string;
  };
  fengShuiAnalysis: FengShuiAnalysis | null;
  recommendedProducts: Product[];
  userEmail: string;
  isAnalysisLoading: boolean;
  isProductsLoading: boolean;
  error: string | null;
  setUserBirthInfo: (info: { date: string; time: string; location: string }) => void;
  setFengShuiAnalysis: (analysis: FengShuiAnalysis) => void;
  setRecommendedProducts: (products: Product[]) => void;
  setUserEmail: (email: string) => void;
  setIsAnalysisLoading: (loading: boolean) => void;
  setIsProductsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userBirthInfo, setUserBirthInfo] = useState({
    date: '',
    time: '',
    location: '',
  });
  
  const [fengShuiAnalysis, setFengShuiAnalysis] = useState<FengShuiAnalysis | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    userBirthInfo,
    fengShuiAnalysis,
    recommendedProducts,
    userEmail,
    isAnalysisLoading,
    isProductsLoading,
    error,
    setUserBirthInfo,
    setFengShuiAnalysis,
    setRecommendedProducts,
    setUserEmail,
    setIsAnalysisLoading,
    setIsProductsLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};