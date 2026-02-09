import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const initialProducts = [
  // Earrings
  { id: 'e1', category: 'earrings', name: 'Diamond Studs', price: 1200, image: '/images/category-earrings.jpg', description: 'Classic diamond studs for everyday elegance.', isVisible: true },
  { id: 'e2', category: 'earrings', name: 'Gold Hoops', price: 450, image: '/images/earring-2.jpg', description: 'Timeless gold hoops that go with everything.', isVisible: true },
  { id: 'e3', category: 'earrings', name: 'Pearl Drop Earrings', price: 850, image: '/images/earring-3.jpg', description: 'Elegant pearl drops for special occasions.', isVisible: true },
  { id: 'e4', category: 'earrings', name: 'Sapphire Halo Studs', price: 2100, image: '/images/earring-4.jpg', description: 'Stunning sapphire studs surrounded by diamonds.', isVisible: true },
  { id: 'e5', category: 'earrings', name: 'Rose Gold Climbers', price: 650, image: '/images/earring-5.jpg', description: 'Modern rose gold climbers for a trendy look.', isVisible: true },
  { id: 'e6', category: 'earrings', name: 'Emerald Drops', price: 3400, image: '/images/earring-6.jpg', description: 'Luxurious emerald drops that make a statement.', isVisible: true },

  // Necklaces
  { id: 'n1', category: 'necklaces', name: 'Diamond Pendant', price: 1800, image: '/images/category-necklaces.jpg', description: 'A brilliant diamond pendant on a delicate chain.', isVisible: true },
  { id: 'n2', category: 'necklaces', name: 'Gold Chain Layer', price: 950, image: '/images/necklace-2.jpg', description: 'Perfect for layering or wearing alone.', isVisible: true },
  { id: 'n3', category: 'necklaces', name: 'Pearl Strand', price: 2500, image: '/images/necklace-3.jpg', description: 'A classic strand of cultured pearls.', isVisible: true },
  { id: 'n4', category: 'necklaces', name: 'Initial Necklace', price: 350, image: '/images/necklace-4.jpg', description: 'Personalized initial necklace in 14k gold.', isVisible: true },
  { id: 'n5', category: 'necklaces', name: 'Emerald Pendant', price: 4200, image: '/images/necklace-5.jpg', description: 'A captivating emerald pendant.', isVisible: true },
  { id: 'n6', category: 'necklaces', name: 'Choker Necklace', price: 550, image: '/images/necklace-6.jpg', description: 'Chic and modern choker style.', isVisible: true },

  // Rings
  { id: 'r1', category: 'rings', name: 'Solitaire Diamond Ring', price: 5500, image: '/images/category-rings.jpg', description: 'The ultimate symbol of love.', isVisible: true },
  { id: 'r2', category: 'rings', name: 'Vintage Gold Band', price: 850, image: '/images/hero-bg.jpg', description: 'Intricate vintage-inspired design.', isVisible: true },
  { id: 'r3', category: 'rings', name: 'Sapphire Cocktail Ring', price: 3200, image: '/images/ring-3.jpg', description: 'A bold statement piece.', isVisible: true },
  { id: 'r4', category: 'rings', name: 'Eternity Band', price: 2800, image: '/images/ring-4.jpg', description: 'Diamonds all around.', isVisible: true },
  { id: 'r5', category: 'rings', name: 'Rose Gold Stackable', price: 450, image: '/images/ring-5.jpg', description: 'Mix and match with other bands.', isVisible: true },
  { id: 'r6', category: 'rings', name: 'Emerald Cut Ring', price: 6900, image: '/images/category-rings.jpg', description: 'Sophisticated emerald cut diamond.', isVisible: true },
  { id: 'r7', category: 'rings', name: 'Ruby Statement Ring', price: 4200, image: '/images/ring-3.jpg', description: 'Vibrant red ruby centered in gold.', isVisible: true },
  { id: 'r8', category: 'rings', name: 'Topaz Halo Ring', price: 1200, image: '/images/ring-4.jpg', description: 'Blue topaz with diamond halo.', isVisible: true },
  { id: 'r9', category: 'rings', name: 'Opal Signet Ring', price: 890, image: '/images/ring-5.jpg', description: 'Classic signet with a fiery opal.', isVisible: true },
  { id: 'r10', category: 'rings', name: 'Pink Sapphire Band', price: 1500, image: '/images/ring-4.jpg', description: 'Delicate band with pink sapphires.', isVisible: true },
  { id: 'r11', category: 'rings', name: 'Tourmaline Cluster', price: 2100, image: '/images/ring-3.jpg', description: 'Multi-colored tourmaline gems.', isVisible: true },
  { id: 'r12', category: 'rings', name: 'Garnet Vintage Ring', price: 750, image: '/images/ring-5.jpg', description: 'Deep red garnet in antique setting.', isVisible: true },
  { id: 'r13', category: 'rings', name: 'Pearl & Diamond Ring', price: 1800, image: '/images/category-rings.jpg', description: 'Cultured pearl with diamond accents.', isVisible: true },
  { id: 'r14', category: 'rings', name: 'Spinel Eternity Band', price: 2400, image: '/images/ring-4.jpg', description: 'Black spinel eternity band.', isVisible: true },

  // More Earrings
  { id: 'e7', category: 'earrings', name: 'Diamond Studs II', price: 1200, image: '/images/category-earrings.jpg', description: 'Classic diamond studs.', isVisible: true },
  { id: 'e8', category: 'earrings', name: 'Gold Hoops II', price: 450, image: '/images/category-earrings.jpg', description: 'Essential gold hoops.', isVisible: true },
  { id: 'e9', category: 'earrings', name: 'Emerald Drop Earrings', price: 3500, image: '/images/category-earrings.jpg', description: 'Elegant emerald drops.', isVisible: true },
  { id: 'e10', category: 'earrings', name: 'Sapphire Huggies', price: 890, image: '/images/category-earrings.jpg', description: 'Blue sapphire huggie hoops.', isVisible: true },
  { id: 'e11', category: 'earrings', name: 'Pearl Studs', price: 300, image: '/images/category-earrings.jpg', description: 'Timeless freshwater pearls.', isVisible: true },
  { id: 'e12', category: 'earrings', name: 'Ruby Climbers', price: 1100, image: '/images/category-earrings.jpg', description: 'Climbing earrings with rubies.', isVisible: true },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now().toString() }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductsByCategory = (category) => {
    return products.filter((p) => p.category === category && p.isVisible);
  };

  const getNewArrivals = () => {
    return products.filter((p) => p.isNewArrival && p.isVisible);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductsByCategory, getNewArrivals }}>
      {children}
    </ProductContext.Provider>
  );
};
