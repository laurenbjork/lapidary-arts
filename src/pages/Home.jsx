import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Gem, PenTool, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import { useContent } from '../context/ContentContext';
import { useProducts } from '../context/ProductContext';

const Home = () => {
  const { content } = useContent();
  const { hero, categories, customDesign, watches, brandStory } = content;
  const { getNewArrivals } = useProducts();
  const newArrivals = getNewArrivals();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${hero.image}')` }}
        ></motion.div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white italic mb-8 drop-shadow-lg"
          >
            {hero.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <Link 
                to={hero.buttonLink} 
                className="bg-black text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white hover:text-black transition-all duration-300"
            >
                {hero.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Trio */}
      <section className="py-12 px-4 max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Bracelets', image: categories.bracelets, path: '/shop/bracelets', delay: 0 },
            { name: 'Rings', image: categories.rings, path: '/shop/rings', delay: 0.2 },
            { name: 'Earrings', image: categories.earrings, path: '/shop/earrings', delay: 0.4 }
          ].map((category) => (
            <FadeIn key={category.name} delay={category.delay} className="relative group h-[600px] overflow-hidden cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${category.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="absolute bottom-16 left-0 right-0 text-center">
                <h3 className="text-white font-serif text-4xl italic mb-6">{category.name}</h3>
                <Link 
                  to={category.path}
                  className="inline-block border border-white text-white px-8 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Shop Now
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Discover The Latest */}
      <section className="py-20 px-4 text-center">
        <FadeIn>
            <h2 className="font-serif text-4xl text-gray-900 mb-2">Discover The Latest</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-12">Explore New Arrivals</p>
        </FadeIn>
        
        {/* Simplified Product Grid for "Carousel" look */}
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
             {newArrivals.slice(0, 4).map((product, index) => (
               <FadeIn key={product.id} delay={0.1 * (index + 1)}>
                  <ProductCard product={product} />
               </FadeIn>
             ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm italic py-10">No new arrivals to display.</div>
        )}
        
        <FadeIn delay={0.5} className="flex justify-center mt-8 space-x-4">
             <button className="text-gray-400 hover:text-black"><ChevronLeft size={20} /></button>
             <button className="text-gray-400 hover:text-black"><ChevronRight size={20} /></button>
        </FadeIn>
      </section>

      {/* Watches Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
                <FadeIn className="max-w-md">
                    <h2 className="font-serif text-4xl text-gray-900 mb-4 uppercase tracking-widest">{watches?.title || 'Watches'}</h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {watches?.description || 'Lapidary Art presents a curated collection of Vintage Rolex Timepieces, selected for their heritage, craftsmanship, and enduring significance.'}
                    </p>
                    <Link to={watches?.linkUrl || '/watches'} className="text-[10px] uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                        {watches?.linkText || 'Explore Our Curated Selection'}
                    </Link>
                </FadeIn>
                <div className="flex space-x-2">
                     <button className="text-gray-400 hover:text-black"><ChevronLeft size={20} /></button>
                     <button className="text-gray-400 hover:text-black"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(watches?.items || [1, 2, 3]).map((item, index) => (
                    <FadeIn key={index} delay={index * 0.1} className="relative group">
                        <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
                             <img 
                                src={item.image || `/images/necklace-${index+1}.jpg`} 
                                alt={item.title || "Watch"} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                             />
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-sm uppercase tracking-wider">{item.title || 'Lady Datejust'}</h3>
                            <p className="text-[10px] opacity-80">{item.subtitle || 'Rolex Certified Pre-Owned'}</p>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Side: Content */}
            <FadeIn direction="left" className="order-2 md:order-1">
                <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
                    {customDesign?.title || 'Custom Design'}
                </h2>
                <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                    {customDesign?.description || 'Your vision, brought to life with unparalleled artistry. Our custom design process ensures every detail reflects your unique story and style.'}
                </p>

                <div className="space-y-8 mb-10">
                    {(customDesign?.features || [
                        { title: 'Personal Consultation', description: 'Begin with an intimate discussion of your vision and preferences' },
                        { title: 'Expert Design', description: 'Our artisans create detailed renderings for your approval' },
                        { title: 'Masterful Craftsmanship', description: 'Watch as your dream piece is meticulously handcrafted' }
                    ]).map((feature, index) => (
                        <div key={index} className="flex items-start">
                            <div className="bg-burgundy text-white p-3 rounded-full mr-4 flex-shrink-0">
                                {index === 0 && <PenTool size={20} />}
                                {index === 1 && <Gem size={20} />}
                                {index === 2 && <Award size={20} />}
                            </div>
                            <div>
                                <h3 className="font-serif text-lg text-gray-900 mb-1">{feature.title}</h3>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Link 
                    to={customDesign?.buttonLink || '/custom-design'}
                    className="inline-block bg-burgundy text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-burgundy-light transition-colors"
                >
                    {customDesign?.buttonText || 'Start Your Design'}
                </Link>
            </FadeIn>

            {/* Right Side: Image */}
            <FadeIn direction="right" className="order-1 md:order-2 h-[600px] bg-gray-50 overflow-hidden relative">
                <img 
                    src={customDesign?.image || '/images/custom-design-feature.jpg'} 
                    alt="Custom Jewelry Design" 
                    className="w-full h-full object-cover object-center" 
                />
            </FadeIn>
         </div>
      </section>

      {/* Brand Story / Footer CTA */}
      <section className="relative h-[500px] w-full mt-20 overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center fixed-bg"
            style={{ backgroundImage: `url('${brandStory?.image || '/images/hero-bg.jpg'}')`, backgroundPosition: 'center 60%' }}
         ></div>
         <div className="absolute inset-0 bg-black/40"></div>
         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
             <FadeIn direction="up">
                <p className="text-xs text-white uppercase tracking-widest mb-4">{brandStory?.smallText || 'www.lapidaryart.com'}</p>
                <h2 className="font-serif text-4xl md:text-6xl text-white max-w-4xl leading-tight whitespace-pre-line">
                    {brandStory?.largeText || 'Future heirlooms designed \nand crafted in Los Angeles.'}
                </h2>
             </FadeIn>
         </div>
      </section>

      {/* Press Logos */}
      <section className="py-16 border-b border-gray-100">
          <FadeIn className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-serif text-2xl">WHO WHAT WEAR</span>
              <span className="font-serif text-2xl">BAZAAR</span>
              <span className="font-serif text-2xl">Bloomberg</span>
              <span className="font-serif text-2xl">WWD</span>
          </FadeIn>
      </section>

      {/* Instagram Feed */}
      <section className="py-20">
          <div className="text-center mb-12">
              <FadeIn>
                <h2 className="font-serif text-3xl text-gray-900 mb-2">Follow Us on Instagram</h2>
                <a href="#" className="text-xs uppercase tracking-widest border-b border-gray-900 pb-1">@lapidaryartjewelry</a>
              </FadeIn>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
             {[1,2,3,4,5].map((i) => (
                 <FadeIn key={i} delay={i * 0.1} className="aspect-square bg-gray-100 overflow-hidden group relative">
                     <img src={`/images/earring-${i+1}.jpg`} alt="Instagram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="font-serif text-2xl italic">LA</span>
                     </div>
                 </FadeIn>
             ))}
          </div>
      </section>
    </div>
  );
};

export default Home;