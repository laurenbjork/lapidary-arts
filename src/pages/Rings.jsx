import React from 'react';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';

const Rings = () => {
  const { getProductsByCategory } = useProducts();
  const products = getProductsByCategory('rings');

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Rings</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">Symbolize your love or express your style. Explore our collection of diamond, gemstone, and gold rings.</p>
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

export default Rings;
