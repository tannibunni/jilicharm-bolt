import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.6 
        : scrollLeft + clientWidth * 0.6;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display text-accent-800">{title}</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 text-accent-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 text-accent-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;