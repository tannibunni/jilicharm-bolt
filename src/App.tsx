import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import pages
import BirthInfoPage from './pages/BirthInfoPage';
import AnalysisPage from './pages/AnalysisPage';
import ThemeSelectionPage from './pages/ThemeSelectionPage';
import ProductRecommendationPage from './pages/ProductRecommendationPage';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-primary-50 text-accent-800 flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-md mx-auto px-4 sm:px-6 pb-8 pt-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<BirthInfoPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/themes" element={<ThemeSelectionPage />} />
            <Route path="/recommendations/:theme" element={<ProductRecommendationPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;