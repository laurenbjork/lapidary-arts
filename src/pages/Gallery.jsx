import React, { useState } from 'react';
import { useGallery } from '../context/GalleryContext';
import FadeIn from '../components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = () => {
  const { images, loading } = useGallery();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="pt-48 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8 leading-tight text-center">
          Gallery
        </h1>
        <p className="text-gray-500 text-xl font-serif italic mb-10 text-center">
          A collection of our past designs and beautiful moments.
        </p>
      </FadeIn>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <FadeIn key={image.id} delay={index * 0.05}>
              <div 
                className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm shadow-lg group cursor-pointer" 
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image.image_url} 
                  alt={image.alt_text} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <motion.img 
                key={images[selectedImage].id}
                src={images[selectedImage].image_url} 
                alt={images[selectedImage].alt_text} 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors">
              <ChevronLeft size={32} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors">
              <ChevronRight size={32} />
            </button>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors">
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
