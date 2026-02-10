import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import QuickView from './QuickView';

const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className="group">
        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
             <button 
                onClick={() => setIsQuickViewOpen(true)}
                className="bg-white text-gray-900 px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-burgundy hover:text-white transition-colors flex items-center"
             >
                <Eye size={14} className="mr-2" /> View Details
             </button>
          </div>
          
          {product.isNewArrival && (
             <div className="absolute top-2 left-2 bg-burgundy text-white text-[10px] uppercase tracking-widest px-2 py-1">
                New
             </div>
          )}
        </div>
        
        <div className="text-center space-y-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-serif text-gray-900 hover:text-burgundy transition-colors">{product.name}</h3>
          </Link>
          {product.subTitle && (
            <p className="text-xs text-gray-500 font-light">{product.subTitle}</p>
          )}
          <p className="text-sm text-gray-500">
            {product.hidePrice ? 'Price Upon Request' : `$${product.price.toLocaleString()}`}
          </p>
        </div>
      </div>

      <QuickView 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
