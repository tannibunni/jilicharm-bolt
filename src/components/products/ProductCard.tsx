import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Product, ElementType } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getElementBadgeClass = (element: ElementType): string => {
    const classes = {
      wood: 'bg-wood-50 text-wood-800 border border-wood-200',
      fire: 'bg-fire-50 text-fire-800 border border-fire-200',
      earth: 'bg-earth-50 text-earth-800 border border-earth-200',
      metal: 'bg-metal-50 text-metal-800 border border-metal-200',
      water: 'bg-water-50 text-water-800 border border-water-200',
    };
    return classes[element];
  };
  
  return (
    <a
      href={product.shopifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="min-w-[280px] w-[280px] bg-white/80 backdrop-blur-sm border border-primary-100 rounded-xl shadow-sm overflow-hidden flex flex-col group focus:outline-none focus:ring-2 focus:ring-accent-700/40"
      tabIndex={0}
    >
      <div className="w-full aspect-square overflow-hidden relative">
        {product.onSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium shadow-sm">
            SALE
          </div>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-accent-800 mb-1 line-clamp-1 group-hover:underline">{product.name}</h3>
        <p className="text-sm text-accent-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.elements.map((element) => (
            <span 
              key={element}
              className={`text-xs px-2 py-0.5 rounded-full ${getElementBadgeClass(element)}`}
            >
              {element}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-accent-800">{product.price}</span>
            {product.onSale && product.originalPrice && (
              <span className="text-sm text-accent-400 line-through">{product.originalPrice}</span>
            )}
          </div>
          <span className="inline-flex items-center text-sm text-accent-700 group-hover:text-accent-900 font-medium">
            View <ExternalLink size={14} className="ml-1" />
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;