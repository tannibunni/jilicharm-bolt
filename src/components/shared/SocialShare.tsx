import React from 'react';
import { Share2, Copy, Instagram, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  message?: string;
  url?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  message = 'Check out my Feng Shui analysis!', 
  url = window.location.href 
}) => {
  const shareUrl = encodeURIComponent(url);
  const shareMessage = encodeURIComponent(message);
  
  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${shareMessage}%20${shareUrl}`, '_blank');
  };
  
  const handleInstagramShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Feng Shui Analysis',
        text: message,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied! Paste it in your Instagram story or DM.');
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };
  
  return (
    <div className="py-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Share2 size={16} className="text-accent-600" />
        <span className="text-sm font-medium text-accent-700">Share your results</span>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleWhatsAppShare}
          className="flex flex-col items-center justify-center p-3 rounded-full bg-primary-50 hover:bg-primary-100 text-accent-700 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={24} />
          <span className="text-xs mt-1">WhatsApp</span>
        </button>
        
        <button
          onClick={handleInstagramShare}
          className="flex flex-col items-center justify-center p-3 rounded-full bg-primary-50 hover:bg-primary-100 text-accent-700 transition-colors"
          aria-label="Share on Instagram"
        >
          <Instagram size={24} />
          <span className="text-xs mt-1">Instagram</span>
        </button>
        
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center justify-center p-3 rounded-full bg-primary-50 hover:bg-primary-100 text-accent-700 transition-colors"
          aria-label="Copy link"
        >
          <Copy size={24} />
          <span className="text-xs mt-1">Copy link</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;