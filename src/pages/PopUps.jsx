import React from 'react';
import FadeIn from '../components/FadeIn';

const PopUps = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Pop Ups</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Visit us in person at our upcoming events.
        </p>
      </FadeIn>
      
      <FadeIn className="max-w-3xl mx-auto bg-[#f9f5f3] p-12 text-center">
          <h2 className="font-serif text-2xl italic mb-4">Upcoming Events</h2>
          <p className="text-gray-600 text-sm tracking-wide mb-8">
              Stay tuned for our next location. We bring our exclusive collections to cities around the world.
          </p>
          <div className="inline-block border border-gray-900 px-8 py-3 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-900 hover:text-white transition-colors">
              Join Newsletter for Updates
          </div>
      </FadeIn>
    </div>
  );
};

export default PopUps;