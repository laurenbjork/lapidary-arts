import React from 'react';
import FadeIn from '../components/FadeIn';

const SizeGuide = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Size Guide</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Find your perfect fit
        </p>
      </FadeIn>

      <FadeIn className="prose prose-stone mx-auto">
        <h3 className="font-serif text-2xl italic mb-4">Ring Sizing</h3>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          The most accurate way to determine your ring size is to visit our showroom for a professional fitting. 
          However, if you are looking to measure at home, measure the inside diameter of a ring that fits you well 
          and compare it to a standard ring size chart.
        </p>

        <h3 className="font-serif text-2xl italic mb-4">Necklace Lengths</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm mb-8">
          <li><strong>14-16":</strong> Choker style, sits high on the neck.</li>
          <li><strong>18":</strong> Princess length, sits on the collarbone (most common).</li>
          <li><strong>20-24":</strong> Matinee length, sits at the center of the bust.</li>
          <li><strong>30"+:</strong> Opera length, sits below the bust.</li>
        </ul>

        <h3 className="font-serif text-2xl italic mb-4">Bracelet Sizing</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Measure your wrist just below the wrist bone, where you would normally wear your bracelet, with a flexible measuring tape 
          or a strip of paper.
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm mt-4">
          <li><strong>Snug Fit:</strong> Add 1/4" to 1/2" to your wrist measurement.</li>
          <li><strong>Comfort Fit:</strong> Add 3/4" to 1" to your wrist measurement.</li>
          <li><strong>Loose Fit:</strong> Add 1 1/4" to your wrist measurement.</li>
        </ul>
      </FadeIn>
    </div>
  );
};

export default SizeGuide;
