import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const Shop = () => {
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  
  const { products } = useProducts();
  const [displayLimit, setDisplayLimit] = useState(12);
  
  // Reset limit on category change
  useEffect(() => {
    setDisplayLimit(12);
  }, [category, searchQuery]);

  // Filter products based on category or search query
  const filteredProducts = products.filter(p => {
    if (!p.isVisible) return false;

    // Search Query Logic
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || 
               (p.description && p.description.toLowerCase().includes(q)) ||
               (p.category && p.category.toLowerCase().includes(q));
    }

    // Category Logic
    if (category) {
        let searchCat = category.toLowerCase();
        
        // Handle "all-" prefix (e.g. "all-earrings" -> "earrings")
        if (searchCat.startsWith('all-')) {
            searchCat = searchCat.replace('all-', '');
        }

        // Category Aliases (URL slug -> DB Category Value)
        const categoryAliases = {
            'bridal-&-engagement': 'engagement',
            'diamonds-&-gemstones': 'diamonds',
            'watches': 'watches' 
        };

        const mappedCategory = categoryAliases[searchCat] || searchCat;
        const pCat = p.category ? p.category.toLowerCase() : '';
        
        // Exact category match (checks both original slug and mapped category)
        if (pCat === searchCat || pCat === mappedCategory) return true;

        // For subcategories, check name/description for keywords
        const normalizedSearch = searchCat.replace(/-/g, ' ');
        const keywords = normalizedSearch.split(' ').filter(k => k.length > 2 && k !== 'and' && k !== '&');
        
        if (keywords.length > 0) {
          return keywords.some(k => {
            const lowerName = p.name.toLowerCase();
            const lowerDesc = p.description ? p.description.toLowerCase() : '';
            
            // Check exact keyword
            if (lowerName.includes(k) || lowerDesc.includes(k)) return true;

            // Check singular form (e.g. "hoops" -> "hoop")
            if (k.endsWith('s')) {
                const singular = k.slice(0, -1);
                if (singular.length > 2 && (lowerName.includes(singular) || lowerDesc.includes(singular))) return true;
            }
            
            return false;
          });
        }
        
        // Fallback for simple string match
        return p.name.toLowerCase().includes(normalizedSearch) || 
               (p.description && p.description.toLowerCase().includes(normalizedSearch));
    }

    return true;
  });

  const visibleProducts = filteredProducts.slice(0, displayLimit);
  const totalProducts = filteredProducts.length;

  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category 
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