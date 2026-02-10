import React, { useEffect } from 'react';
import { X, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QuickView = ({ product, isOpen, onClose }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></motion.div>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black bg-white/80 p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image */}
          <div className="bg-gray-50 h-[300px] md:h-full relative">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
            <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">{product.category}</div>
            <h2 className="font-serif text-3xl text-gray-900 mb-2">{product.name}</h2>
            {product.subTitle && (
              <h3 className="text-sm text-gray-500 font-light mb-4">{product.subTitle}</h3>
            )}
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-xl text-gray-900">
                {product.hidePrice ? 'Price Upon Request' : `$${product.price.toLocaleString()}`}
              </div>
              {!product.hidePrice && (
              <div className="flex items-center text-yellow-500 text-xs">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-gray-400 ml-2">(12)</span>
              </div>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-4">
              {product.description}
            </p>

            <div className="space-y-4 mt-auto">
              <Link 
                to={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center justify-center w-full bg-burgundy text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-light transition-colors"
              >
                View Full Details <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickView;
