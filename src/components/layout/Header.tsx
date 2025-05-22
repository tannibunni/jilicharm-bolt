import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="w-full bg-accent-800/95 backdrop-blur-sm shadow-sm py-4 px-4 sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between">
       <Link to="/" className="flex items-center space-x-2 text-primary-50">
  <span className="text-2xl text-primary-300">☯</span>
  <span className="font-display text-xl">Check Your Elemental Energy</span>
</Link>
        
        {location.pathname !== '/' && (
          <Link 
            to="/" 
            className="text-sm font-medium text-primary-100 hover:text-primary-50 transition-colors"
          >
            New Analysis
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;