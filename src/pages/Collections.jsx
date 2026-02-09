import React from 'react';
import { useParams } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const Collections = () => {
  const { collection } = useParams();

  const collectionsList = [
    'Marea', 'Butterflies', 'Constellation', 'Mermaid Jewels', '222', 'Magic Mushroom', 'Signature Love Locks',
    'Bridal & Engagement Rings', 'Bridal Jewelry', 'Love Notes', 'Make It Personal', 'Ball & Chain', 'Crystals', 'LS Classics', 'Unisex'
  ];

  if (collection) {
    const displayTitle = collection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <div key={collection} className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">{displayTitle}</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
            Collection
          </p>
        </FadeIn>
        <FadeIn className="text-center py-20 border-t border-gray-100">
            <p className="text-gray-500 font-serif italic text-xl">Products for {displayTitle} coming soon.</p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Collections</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Curated series of inspired designs.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectionsList.map((col, index) => (
          <FadeIn key={index} delay={index * 0.05} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors duration-500"></div>
               {/* Placeholder for collection image */}
               <h3 className="relative z-10 font-serif text-2xl italic text-gray-900">{col}</h3>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default Collections;