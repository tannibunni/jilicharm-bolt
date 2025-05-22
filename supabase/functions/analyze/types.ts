export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type ThemeType = 'wealth' | 'career' | 'relationships' | 'health';

export interface FengShuiAnalysis {
  elements: {
    [key in ElementType]: number;
  };
  dominantElement: ElementType;
  favorableElements: ElementType[];
  recommendations: string[];
}