import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const goals = [
  'Love ❤️',
  'Career 💼',
  'Wealth 💰',
  'Health 🌿',
  'Harmony 🧘‍♀️',
  'Luck 🍀',
  'Growth 📚',
  'Relationships 💑'
];

const RotatingTextBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % goals.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-[#EBA49D] to-[#CF6E68] py-16 px-4 mb-16 rounded-xl shadow-md">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center space-y-10">
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white leading-snug">
          What do you want to improve today?
        </h2>

        <div className="h-16 relative w-full">
          <AnimatePresence mode="wait">
            <motion.span
              key={goals[currentIndex]}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 text-3xl sm:text-4xl font-display font-bold text-white drop-shadow-md flex items-center justify-center"
            >
              {goals[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={() => navigate('/themes')}
          className="bg-white text-[#CF6E68] hover:bg-white/90 font-medium font-sans py-4 px-8 rounded-full transition-colors duration-300 shadow-md text-lg"
        >
          Get More Feng Shui Tips
        </button>
      </div>
    </section>
  );
};

export default RotatingTextBanner;