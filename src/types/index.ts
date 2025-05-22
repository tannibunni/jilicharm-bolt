export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface FiveElements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface FengShuiAnalysis {
  elements: FiveElements;
  dominantElement: ElementType;
  favorableElements: ElementType[];
  luckyColors: string[];
  recommendations: string[];
  encouragement: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  shopifyUrl: string;
  price: string;
  originalPrice?: string;
  onSale?: boolean;
  elements: ElementType[];
  themes: ThemeType[];
}

export type ThemeType = 'love' | 'career' | 'family' | 'friendship' | 'health' | 'kids' | 'study' | 'luck' | 'wealth';

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  icon: string;
}