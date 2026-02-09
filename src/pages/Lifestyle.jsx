import React from 'react';
import FadeIn from '../components/FadeIn';

const Lifestyle = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Lifestyle</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Beyond jewelry. Elevate your everyday.
        </p>
      </FadeIn>
      
      <FadeIn className="text-center py-20 border-t border-gray-100">
          <p className="text-gray-500 font-serif italic text-xl">Lifestyle collection coming soon.</p>
      </FadeIn>
    </div>
  );
};

export default Lifestyle;