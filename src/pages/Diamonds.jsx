import React from 'react';
import { useProducts } from '../context/ProductContext';
import FadeIn from '../components/FadeIn';

const Diamonds = () => {
  const { getProductsByCategory } = useProducts();
  const products = getProductsByCategory('diamonds');

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Diamonds & Gemstones</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">Discover our collection of loose diamonds and precious gemstones.</p>
      </FadeIn>

      {products.length === 0 ? (
        <FadeIn className="text-center py-20 bg-gray-50">
            <p className="font-serif text-2xl text-gray-400">Inventory Coming Soon</p>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.1} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${product.image}')` }}
                ></div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white">
                    Quick View
                </button>
                </div>
                <div className="text-center">
                <h3 className="font-serif text-lg text-gray-900 mb-1 italic">{product.name}</h3>
                <p className="text-gray-900 text-xs tracking-widest">
                    {product.discountPrice ? (
                        <>
                            <span className="text-red-700 mr-2">${product.discountPrice.toLocaleString()}</span>
                            <span className="line-through text-gray-400 text-[10px]">${product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        `$${product.price.toLocaleString()}`
                    )}
                </p>
                </div>
            </FadeIn>
            ))}
        </div>
      )}
    </div>
  );
};

export default Diamonds;
