import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/jilicharm-logo-white.png';
import { useAppContext } from '../../contexts/AppContext';
import { saveUserEmail, saveUserAnalysis } from '../../services/apiService';

interface HeaderProps {
  showNewAnalysis?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNewAnalysis = true }) => {
  const navigate = useNavigate();
  const { userBirthInfo, fengShuiAnalysis } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewAnalysisClick = () => {
    setShowModal(true);
  };

  const handleSkip = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await saveUserEmail(email);
      if (fengShuiAnalysis && userBirthInfo.date && userBirthInfo.time) {
        await saveUserAnalysis(email, userBirthInfo, fengShuiAnalysis);
      }
      setShowModal(false);
      navigate('/');
    } catch (err) {
      setError('Failed to save your email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <header className="bg-[#2E3532] border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-2 flex items-center justify-between relative min-h-[56px]">
        {/* Logo，移动端和桌面端都显示，但桌面端更大，移动端更小 */}
        <a 
          href="https://jilicharm.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-80 transition-opacity z-10"
        >
          <img 
            src={logoImage} 
            alt="JILICHARM" 
            className="h-6 w-auto sm:h-7"
          />
        </a>
        {/* 标题，移动端靠左，桌面端居中 */}
        <div
          className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 pointer-events-none select-none flex-1 text-left sm:text-center"
        >
          <span className="text-white text-base font-medium tracking-wide whitespace-nowrap opacity-90 block">Analysis Result</span>
        </div>
        {/* New Analysis Button，移动端显示在右侧 */}
        {showNewAnalysis && (
          <button
            onClick={handleNewAnalysisClick}
            className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium px-3 py-1.5 rounded-2xl transition-colors duration-200 z-10 shadow-sm min-w-[90px] block"
          >
            New Analysis
          </button>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-xs w-full mx-4 p-6 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-accent-400 hover:text-accent-700 text-xl"
              onClick={handleSkip}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2 text-accent-800 text-center">Get Your Full Feng Shui Report?</h2>
            <p className="text-accent-700 text-sm mb-4 text-center">Enter your email to receive a detailed report, or skip to start a new analysis.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-800/20 placeholder-accent-400 text-accent-800"
                required
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-800 hover:bg-accent-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-accent-400"
              >
                {isSubmitting ? 'Sending...' : 'Get My Report'}
              </button>
            </form>
            <button
              onClick={handleSkip}
              className="w-full mt-3 text-accent-600 hover:text-accent-800 text-sm underline"
            >
              Skip, just start a new analysis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;