import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface EncouragementCardProps {
  message: string;
}

const EncouragementCard: React.FC<EncouragementCardProps> = ({ message }) => {
  return (
    <motion.div
      className="my-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="bg-white/80 backdrop-blur-sm border border-primary-100 shadow-sm rounded-xl p-6">
        <div className="flex items-start">
          <Quote size={24} className="text-accent-400 mr-3 shrink-0" />
          <p className="text-xl font-display italic text-accent-800">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EncouragementCard;