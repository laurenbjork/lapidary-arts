import React from 'react';
import { useContent } from '../context/ContentContext';
import FadeIn from '../components/FadeIn';

const About = () => {
  const { content } = useContent();
  const { about } = content;

  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <FadeIn>
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">{about?.title || 'About Lapidary Art'}</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">{about?.subtitle || 'A legacy of craftsmanship and passion for fine jewelry.'}</p>
        </FadeIn>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
         <FadeIn>
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg shadow-md">
                <img 
                    src={about?.image || '/images/home-hero-model.jpg'} 
                    alt="About Us" 
                    className="w-full h-full object-cover"
                />
            </div>
         </FadeIn>
         
         <FadeIn direction="right" className="text-left">
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {about?.paragraph1 || "Lapidary Art Jewelry was founded with a simple mission: to create breathtaking jewelry that celebrates life's most precious moments. Our team of master jewelers and designers are dedicated to the highest standards of quality and artistry."}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {about?.paragraph2 || "We believe that every piece of jewelry tells a story. Whether it's a custom engagement ring or a timeless necklace, we pour our heart and soul into every creation."}
            </p>
         </FadeIn>
      </div>
    </div>
  );
};

export default About;
