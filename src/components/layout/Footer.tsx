import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-accent-800 text-primary-50 py-6 px-4">
      <div className="max-w-md mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Jilicharm
        </p>
        <p className="text-xs text-primary-200 mt-1">
          Personalized Feng Shui recommendations for your daily life
        </p>
      </div>
    </footer>
  );
};

export default Footer;