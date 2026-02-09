import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const Shop = () => {
  const { category } = useParams();
  const { products } = useProducts();
  const [displayLimit, setDisplayLimit] = useState(12);
  
  // Reset limit on category change
  useEffect(() => {
    setDisplayLimit(12);
  }, [category]);

  // Filter products based on category or stone
  const filteredProducts = category 
    ? products.filter(p => {
        const cat = category.toLowerCase();
        const pCat = p.category.toLowerCase();
        // Check if category matches or if product name/desc includes the category (for stones like 'emerald')
        return pCat === cat || 
               p.name.toLowerCase().includes(cat) || 
               (p.description && p.description.toLowerCase().includes(cat));
      })
    : products;

  const visibleProducts = filteredProducts.slice(0, displayLimit);
  const totalProducts = filteredProducts.length;

  const displayTitle = category 
    ? category.replace(/-/g, ' ') 
    : 'Shop All';

  return (
    <div key={category || 'shop-all'} className="pt-32 pb-20 px-4 md:px-12 max-w-[1920px] mx-auto">
      
      {/* Header */}
      <FadeIn className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 uppercase tracking-widest">
          {displayTitle}
        </h1>
      </FadeIn>

      {/* Filter & Count Bar */}
      <div className="flex justify-between items-center py-4 mb-8 text-[11px] uppercase tracking-widest text-gray-500 font-medium">
        <div className="flex items-center cursor-pointer hover:text-black transition-colors">
          <Filter size={14} className="mr-2" />
          <span>Filter</span>
          <ChevronDown size={12} className="ml-1" />
        </div>
        <div>
          {totalProducts} Results
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 mb-20">
        {visibleProducts.map((product, index) => (
          <FadeIn key={product.id} delay={index * 0.05}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>

      {/* Pagination / Load More */}
      {displayLimit < totalProducts && (
        <div className="text-center border-t border-gray-100 pt-12 max-w-xl mx-auto">
          <p className="text-[10px] text-gray-500 mb-6 tracking-widest">
            You're viewing {Math.min(displayLimit, totalProducts)} of {totalProducts} products
          </p>
          <button 
            onClick={() => setDisplayLimit(prev => prev + 12)}
            className="border border-gray-200 bg-white text-gray-900 px-12 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {totalProducts === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-gray-500 uppercase tracking-widest">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;