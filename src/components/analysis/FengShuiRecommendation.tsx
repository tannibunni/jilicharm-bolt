import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { FengShuiAnalysis, ElementType } from '../../types';

interface FengShuiRecommendationProps {
  analysis: FengShuiAnalysis;
}

const FengShuiRecommendation: React.FC<FengShuiRecommendationProps> = ({ analysis }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const elementEmoji = {
    wood: '🌳',
    fire: '🔥',
    earth: '🪨',
    metal: '⚙️',
    water: '💧',
  };

  const elementDescriptions = {
    wood: 'growth, vitality, and flexibility',
    fire: 'passion, energy, and transformation',
    earth: 'stability, nourishment, and grounding',
    metal: 'clarity, precision, and efficiency',
    water: 'wisdom, intuition, and adaptability',
  };

  const elementPersonalities = {
    wood: {
      strengths: [
        'Natural leader with vision',
        'Adaptable and flexible',
        'Growth-oriented mindset'
      ],
      challenges: [
        'Can be overly competitive',
        'May struggle with patience',
        'Sometimes inflexible in views'
      ]
    },
    fire: {
      strengths: [
        'Charismatic and inspiring',
        'Passionate and energetic',
        'Natural networker'
      ],
      challenges: [
        'Can be impulsive',
        'May burn out quickly',
        'Sometimes overwhelming to others'
      ]
    },
    earth: {
      strengths: [
        'Reliable and nurturing',
        'Practical problem solver',
        'Natural mediator'
      ],
      challenges: [
        'Can be overly cautious',
        'May resist change',
        'Sometimes too self-sacrificing'
      ]
    },
    metal: {
      strengths: [
        'Precise and organized',
        'Strong integrity',
        'Excellence-driven'
      ],
      challenges: [
        'Can be overly critical',
        'May seem distant',
        'Sometimes too perfectionist'
      ]
    },
    water: {
      strengths: [
        'Deep wisdom and insight',
        'Excellent problem solver',
        'Adaptable to change'
      ],
      challenges: [
        'Can be overly fearful',
        'May lack decisiveness',
        'Sometimes too introspective'
      ]
    }
  };

  const elementTooltips = {
    wood: 'Wood energy represents growth and expansion. It brings vitality and helps new projects flourish.',
    fire: 'Fire energy symbolizes transformation and passion. It fuels creativity and warms relationships.',
    earth: 'Earth energy provides stability and nourishment. It grounds you and creates a solid foundation.',
    metal: 'Metal energy brings clarity and precision. It helps with focus and decision-making.',
    water: 'Water energy embodies wisdom and adaptability. It helps navigate change and enhances intuition.',
  };

  const getElementColor = (element: ElementType): string => {
    const colors = {
      wood: 'bg-wood-50 text-wood-800 border-wood-200',
      fire: 'bg-fire-50 text-fire-800 border-fire-200',
      earth: 'bg-earth-50 text-earth-800 border-earth-200',
      metal: 'bg-metal-50 text-metal-800 border-metal-200',
      water: 'bg-water-50 text-water-800 border-water-200',
    };
    return colors[element];
  };

  const handleTooltipClick = (tooltipId: string) => {
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId);
  };

  // Find weakest element
  const getWeakestElement = (): ElementType => {
    let minValue = Infinity;
    let weakestElement: ElementType = 'water';
    
    Object.entries(analysis.elements).forEach(([element, value]) => {
      if (value < minValue) {
        minValue = value;
        weakestElement = element as ElementType;
      }
    });
    
    return weakestElement;
  };

  const weakestElement = getWeakestElement();

  return (
    <motion.div 
      className="rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-primary-100 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-display text-accent-800 mb-6">Your Five Elements Profile</h2>
      
      {/* Dominant Element Section */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 text-accent-800 mr-2" />
          <h3 className="text-lg font-medium text-accent-700">Strongest Element</h3>
          <button
            onClick={() => handleTooltipClick('dominant')}
            className="ml-2 text-accent-400 hover:text-accent-600 transition-colors"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {activeTooltip === 'dominant' && (
          <div className="mb-3 p-3 bg-primary-50 rounded-lg text-sm text-accent-600">
            Your dominant element shapes your core personality traits and natural tendencies.
          </div>
        )}
        <div className={`p-4 rounded-lg border ${getElementColor(analysis.dominantElement)}`}>
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">{elementEmoji[analysis.dominantElement]}</span>
            <div>
              <p className="font-medium capitalize">{analysis.dominantElement}</p>
              <p className="text-sm opacity-90">{elementDescriptions[analysis.dominantElement]}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">Key Strengths:</p>
            <ul className="space-y-1">
              {elementPersonalities[analysis.dominantElement].strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Weakest Element Section */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <TrendingDown className="w-5 h-5 text-accent-800 mr-2" />
          <h3 className="text-lg font-medium text-accent-700">Element to Strengthen</h3>
          <button
            onClick={() => handleTooltipClick('weakest')}
            className="ml-2 text-accent-400 hover:text-accent-600 transition-colors"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {activeTooltip === 'weakest' && (
          <div className="mb-3 p-3 bg-primary-50 rounded-lg text-sm text-accent-600">
            Your underrepresented element indicates areas for growth and balance.
          </div>
        )}
        <div className={`p-4 rounded-lg border ${getElementColor(weakestElement)}`}>
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">{elementEmoji[weakestElement]}</span>
            <div>
              <p className="font-medium capitalize">{weakestElement}</p>
              <p className="text-sm opacity-90">{elementDescriptions[weakestElement]}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">Growth Areas:</p>
            <ul className="space-y-1">
              {elementPersonalities[weakestElement].challenges.map((challenge, index) => (
                <li key={index} className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Favorable Elements Section */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <Scale className="w-5 h-5 text-accent-800 mr-2" />
          <h3 className="text-lg font-medium text-accent-700">Balancing Elements</h3>
          <button
            onClick={() => handleTooltipClick('favorable')}
            className="ml-2 text-accent-400 hover:text-accent-600 transition-colors"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {activeTooltip === 'favorable' && (
          <div className="mb-3 p-3 bg-primary-50 rounded-lg text-sm text-accent-600">
            These elements help create harmony and balance in your life when properly incorporated.
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {analysis.favorableElements.map((element) => (
            <div 
              key={element}
              className={`flex flex-col p-3 rounded-lg ${getElementColor(element)}`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{elementEmoji[element]}</span>
                <span className="font-medium capitalize">{element}</span>
              </div>
              <p className="text-sm">{elementTooltips[element]}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommendations Section */}
      <div>
        <div className="flex items-center mb-3">
          <h3 className="text-lg font-medium text-accent-700">General Fengshui Practice</h3>
          <button
            onClick={() => handleTooltipClick('recommendations')}
            className="ml-2 text-accent-400 hover:text-accent-600 transition-colors"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {activeTooltip === 'recommendations' && (
          <div className="mb-3 p-3 bg-primary-50 rounded-lg text-sm text-accent-600">
            Practical suggestions to enhance your energy balance in daily life.
          </div>
        )}
        <ul className="space-y-3">
          {analysis.recommendations.slice(0, 3).map((recommendation, index) => (
            <li key={index} className="flex items-start bg-primary-50/50 rounded-lg p-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
              <span className="text-accent-700">{recommendation}</span>
            </li>
          ))}
          {analysis.recommendations.slice(3).map((recommendation, index) => (
            <li key={index + 3} className="flex items-start bg-primary-50/50 rounded-lg p-3">
              <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
              <span className="text-accent-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default FengShuiRecommendation;