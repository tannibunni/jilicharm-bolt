import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextBannerProps {
  messages?: string[];
  className?: string;
}

const RotatingTextBanner: React.FC<RotatingTextBannerProps> = ({ messages = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(messages) || messages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [messages]);

  if (!Array.isArray(messages) || messages.length === 0) return null;

  return (
    <div className={`relative min-h-[32px] ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={messages[currentIndex]}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="block"
        >
          {messages[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingTextBanner;