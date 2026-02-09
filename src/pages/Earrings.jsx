import React from 'react';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';

const Earrings = () => {
  const { getProductsByCategory } = useProducts();
  const products = getProductsByCategory('earrings');

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Earrings</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">From classic studs to statement drops, discover our curated collection of earrings designed to elevate every look.</p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product, index) => (
          <FadeIn key={product.id} delay={index * 0.1}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default Earrings;
