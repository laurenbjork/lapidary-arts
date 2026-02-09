import React from 'react';
import { useParams } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const Gifts = () => {
  const { guide } = useParams();

  const giftGuides = [
    "Valentine's Day Gift Guide", 'Daughters', 'Lovers', 'Friend', 'Mamas', 'The Minimalist', 'The Maximalist',
    'Second Skin', 'Bridal Jewelry', 'Best Sellers', '$500 and under', 'LS HOME', 'LS x Amber Lewis Gift Sets'
  ];

  if (guide) {
    const displayTitle = guide.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <div key={guide} className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">{displayTitle}</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
            Gift Guide
          </p>
        </FadeIn>
        <FadeIn className="text-center py-20 border-t border-gray-100">
            <p className="text-gray-500 font-serif italic text-xl">Curated gifts for {displayTitle} coming soon.</p>
        </FadeIn>
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
             <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center p-8 text-center">
               <div className="absolute inset-0 bg-[#f9f5f3] group-hover:bg-[#f0ebe9] transition-colors duration-500"></div>
               <h3 className="relative z-10 font-serif text-xl italic text-gray-900">{g}</h3>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default Gifts;