import React from 'react';
import { X } from 'lucide-react';
import EmailForm from './EmailForm';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-accent-400 hover:text-accent-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-display text-accent-800 mb-2">
            Unlock Your Full Analysis
          </h2>
          <p className="text-accent-600 mb-6">
            Enter your email to explore specific life areas and receive personalized recommendations.
          </p>
          
          <EmailForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default EmailModal;