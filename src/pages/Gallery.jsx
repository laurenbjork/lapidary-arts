import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGallery } from '../context/GalleryContext';
import FadeIn from '../components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand, Minimize } from 'lucide-react';

const Gallery = () => {
  const { media, loading } = useGallery();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  const handleNext = useCallback(() => {
    if (selectedMedia === null) return;
    setSelectedMedia((prev) => (prev + 1) % media.length);
  }, [selectedMedia, media.length]);

  const handlePrev = useCallback(() => {
    if (selectedMedia === null) return;
    setSelectedMedia((prev) => (prev - 1 + media.length) % media.length);
  }, [selectedMedia, media.length]);

  const closeModal = () => {
    setSelectedMedia(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedMedia !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedMedia, handleNext, handlePrev]);

  const toggleFullscreen = () => {
    const elem = modalRef.current;
    if (!document.fullscreenElement) {
      elem?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

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
          {media.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.05}>
              <div 
                className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm shadow-lg group cursor-pointer" 
                onClick={() => setSelectedMedia(index)}
              >
                 {item.media_type === 'youtube' ? (
                  <img 
                    src={`https://img.youtube.com/vi/${item.image_url}/0.jpg`}
                    alt={item.alt_text} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : item.media_type === 'video' ? (
                  <video 
                    src={item.image_url} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={item.image_url} 
                    alt={item.alt_text} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedMedia !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={closeModal}
            ref={modalRef}
            tabIndex="-1"
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors disabled:opacity-50"
                disabled={media.length <= 1}
              >
                <ChevronLeft size={32} />
              </button>

              {/* Image Container */}
              <div
                className={`relative w-full h-full flex items-center justify-center ${
                  media[selectedMedia].media_type === 'youtube' || media[selectedMedia].media_type === 'video'
                    ? 'md:max-w-[52.5vw] md:max-h-[60vh]'
                    : '' // No max size for images, let them be flexible
                }`}
              >
                {media[selectedMedia].media_type === 'youtube' ? (
                  <div className="aspect-video w-[67.5vw] md:w-[52.5vw]">
                    <iframe
                      className="w-full h-full rounded-lg shadow-2xl"
                      src={`https://www.youtube.com/embed/${media[selectedMedia].image_url}?autoplay=1`}
                      title={media[selectedMedia].alt_text}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : media[selectedMedia].media_type === 'video' ? (
                  <video
                    key={media[selectedMedia].id}
                    src={media[selectedMedia].image_url}
                    controls
                    autoPlay
                    className="max-w-[67.5vw] max-h-[67.5vh] object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={media[selectedMedia].image_url}
                    alt={media[selectedMedia].alt_text || ''}
                    className="max-w-[67.5vw] max-h-[67.5vh] object-contain rounded-lg shadow-2xl"
                  />
                )}

                {/* Top Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Expand size={20} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeModal(); }}
                    className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors disabled:opacity-50"
                disabled={media.length <= 1}
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
