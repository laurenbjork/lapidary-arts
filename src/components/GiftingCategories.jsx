import React from 'react';
import { Link } from 'react-router-dom';
import { giftingMenu } from './Navbar';
import FadeIn from './FadeIn';

const categoryImages = {
  'Daughters': '/images/necklace-2.jpg',
  'Lovers': '/images/ring-3.jpg',
  'Friend': '/images/earring-2.jpg',
  'Mamas': '/images/necklace-3.jpg',
  'The Minimalist': '/images/earring-3.jpg',
  'The Maximalist': '/images/necklace-4.jpg',
  'Bridal Jewelry': '/images/ring-4.jpg',
  'Best Sellers': '/images/earring-4.jpg',
};

const GiftingCategories = () => {
  const categories = giftingMenu.filter(item => item !== 'All Gifting');

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Gifting</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Find the perfect piece for everyone on your list.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <FadeIn key={category} delay={index * 0.05} className="group cursor-pointer">
             <Link to={`/gifts/${category.toLowerCase().replace(/ /g, '-')}`} className="block h-full">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center p-8 text-center h-full">
                  <img src={categoryImages[category]} alt={category} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <h3 className="relative z-10 font-serif text-xl italic text-white drop-shadow-sm">{category}</h3>
                </div>
             </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default GiftingCategories;
