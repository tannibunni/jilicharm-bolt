import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo-jilicharm-fengshui.png';

interface HeaderProps {
  showNewAnalysis?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNewAnalysis = true }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="https://jilicharm.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img 
            src={logoImage} 
            alt="JILICHARM" 
            className="h-8 w-auto"
          />
          <span className="text-lg font-display text-accent-800 font-semibold">
            JILICHARM
          </span>
        </a>

        {/* New Analysis Button */}
        {showNewAnalysis && (
          <button
            onClick={() => navigate('/birth-info')}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            New Analysis
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;