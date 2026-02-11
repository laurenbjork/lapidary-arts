import React from 'react';
import { useParams, Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Gifts = () => {
  const { guide } = useParams();
  const { products } = useProducts();

  const giftGuides = [
    'Daughters', 'Lovers', 'Friend', 'Mamas', 'The Minimalist', 'The Maximalist',
    'Bridal Jewelry', 'Best Sellers', '$500 and under'
  ];

  if (guide) {
    const displayTitle = guide.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Filter products for this guide
    const guideProducts = products.filter(p => {
      if (!p.isVisible) return false;
      
      // If "All Gifting", show all products in 'gifting' category
      if (guide === 'all-gifting') {
        if (p.category === 'gifting') return true;
        return (p.additionalCategories || []).some(ac => ac.category === 'gifting');
      }

      // Check main category/subcategory
      const mainMatch = (p.category === 'gifting' && p.subcategory === guide) || 
             (p.subcategory === guide);
      if (mainMatch) return true;

      // Check additional categories
      const additionalMatch = (p.additionalCategories || []).some(ac => {
          if (ac.category === 'gifting' && ac.subcategory === guide) return true;
          if (ac.subcategory === guide) return true;
          return false;
      });

      return additionalMatch;
    });

    return (
      <div key={guide} className="pt-32 pb-20 px-4 max-w-[1920px] mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">{displayTitle}</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
            Gift Guide
          </p>
        </FadeIn>
        
        {guideProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 mb-20">
            {guideProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        ) : (
           <FadeIn className="text-center py-20 border-t border-gray-100">
              <p className="text-gray-500 font-serif italic text-xl">Curated gifts for {displayTitle} coming soon.</p>
           </FadeIn>
        )}
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Gifting</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Find the perfect piece for everyone on your list.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {giftGuides.map((g, index) => (
          <FadeIn key={index} delay={index * 0.05} className="group cursor-pointer">
             <Link to={`/gifts/${g.toLowerCase().replace(/ /g, '-')}`} className="block h-full">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center p-8 text-center h-full">
                  <div className="absolute inset-0 bg-[#f9f5f3] group-hover:bg-[#f0ebe9] transition-colors duration-500"></div>
                  <h3 className="relative z-10 font-serif text-xl italic text-gray-900">{g}</h3>
                </div>
             </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default Gifts;