import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';

const Shop = () => {
  const { category, subcategory } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  
  const { products } = useProducts();
  const [displayLimit, setDisplayLimit] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  
  // Define categories for filter sidebar
  const categories = [
    { name: 'Rings', path: '/shop/rings' },
    { name: 'Necklaces', path: '/shop/necklaces' },
    { name: 'Earrings', path: '/shop/earrings' },
    { name: 'Watches', path: '/shop/watches' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Gifts', path: '/gifts' },
  ];
  
  // Reset limit on category change
  useEffect(() => {
    setDisplayLimit(12);
    setShowFilters(false);
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

    // Category/Subcategory Logic
    if (category) {
      const pCat = p.category ? p.category.toLowerCase() : '';
      const pSub = p.subcategory ? p.subcategory.toLowerCase() : '';

      // Special handling for "all" or "all-products" to show everything
      if (category.toLowerCase() === 'all' || category.toLowerCase() === 'all-products' || category.toLowerCase() === 'shop-all') {
        return true;
      }
      
      // Special handling for "Stone" category which is not a real category in the DB
      if (category.toLowerCase() === 'stone') {
        // Create a single, comprehensive list of all subcategories for the product.
        const allProductSubcategories = [
          p.subcategory,
          ...(p.additionalCategories || []).map(ac => ac.subcategory)
        ].filter(Boolean).map(s => s.toLowerCase());

        // Handle specific subcategory URLs like /shop/stone/diamond
        if (subcategory && !subcategory.toLowerCase().startsWith('all-')) {
          const targetSub = subcategory.toLowerCase();
          return allProductSubcategories.includes(targetSub);
        }

        // Handle general stone URLs like /shop/stone or /shop/stone/all-stones
        const stoneSubcategories = ['gemstone', 'diamond', 'emerald', 'topaz', 'sapphire', 'spinel', 'pearl', 'opal', 'tourmaline', 'ruby', 'garnet', 'zircon', 'tanzanite', 'peridot', 'gemstones'];
        return allProductSubcategories.some(s => stoneSubcategories.includes(s));
      }

      const mainCategoryMatch = pCat === category.toLowerCase();

      if (subcategory) {
        if (subcategory.toLowerCase().startsWith('all-')) {
          if (mainCategoryMatch) return true;
        } else {
          const subCategoryMatch = pSub === subcategory.toLowerCase();
          if (mainCategoryMatch && subCategoryMatch) return true;
        }
      } else {
        if (mainCategoryMatch) return true;
      }

      // Fallback to check additional categories with the same logic
      const additionalCats = p.additional_categories || [];
      return additionalCats.some(ac => {
          const acCat = ac.category ? ac.category.toLowerCase() : '';
          const acSub = ac.subcategory ? ac.subcategory.toLowerCase() : '';
          const addCatMatch = acCat === category.toLowerCase();

          if (subcategory) {
            if (subcategory.toLowerCase().startsWith('all-')) {
              return addCatMatch;
            }
            return addCatMatch && acSub === subcategory.toLowerCase();
          } 
          return addCatMatch;
      });
    }

    return true;
  });

  const visibleProducts = filteredProducts.slice(0, displayLimit);
  const totalProducts = filteredProducts.length;

  const displayTitle = (() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (category) {
      const catName = category.replace(/-/g, ' ');
      if (subcategory && !subcategory.startsWith('all-')) {
        const subName = subcategory.replace(/-/g, ' ');
        return `${catName} - ${subName}`;
      }
      return catName;
    }
    return 'Shop All';
  })();

  return (
    <div key={category || 'shop-all'} className="pt-32 pb-20 px-4 md:px-12 max-w-[1920px] mx-auto">
      
      {/* Header */}
      <FadeIn className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 uppercase tracking-widest">
          {displayTitle}
        </h1>
      </FadeIn>

      {/* Filter & Count Bar */}
      <div className="flex justify-between items-center py-4 mb-8 text-[11px] uppercase tracking-widest text-gray-500 font-medium border-y border-gray-100">
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center cursor-pointer hover:text-black transition-colors bg-transparent border-none p-0 uppercase tracking-widest text-[11px] font-medium"
        >
          <Filter size={14} className="mr-2" />
          <span>Filter</span>
          <ChevronDown size={12} className="ml-1" />
        </button>
        <div>
          {totalProducts} Results
        </div>
      </div>

      {/* Filter Sidebar Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-2xl uppercase tracking-widest">Filter By</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-100">
                  Category
                </h3>
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li key={cat.path}>
                      <Link 
                        to={cat.path}
                        className={`text-[11px] uppercase tracking-widest transition-colors ${
                          location.pathname === cat.path ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
                        }`}
                        onClick={() => setShowFilters(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to="/shop/all"
                      className={`text-[11px] uppercase tracking-widest transition-colors ${
                        location.pathname === '/shop/all' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
                      }`}
                      onClick={() => setShowFilters(false)}
                    >
                      Shop All
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Show {totalProducts} Results
              </button>
            </div>
          </div>
        </div>
      )}

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