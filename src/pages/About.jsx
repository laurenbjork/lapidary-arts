import React from 'react';
import { useContent } from '../context/ContentContext';
import FadeIn from '../components/FadeIn';

const About = () => {
  const { content } = useContent();
  const { about } = content;

  return (
    <div className="pt-48 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
         {/* Text Section - Now on Left */}
         <div className="md:col-span-5 lg:col-span-5 flex flex-col">
            <FadeIn>
                <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
                    {about?.title || 'About Lapidary Art'}
                </h1>
                <div className="w-16 h-1 bg-burgundy mb-8"></div>
                <p className="text-gray-500 text-xl font-serif italic mb-10">
                    {about?.subtitle || 'A legacy of craftsmanship and passion for fine jewelry.'}
                </p>
                
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                    <p>
                        {about?.paragraph1 || "Lapidary Art Jewelry was founded with a simple mission: to create breathtaking jewelry that celebrates life's most precious moments. Our team of master jewelers and designers are dedicated to the highest standards of quality and artistry."}
                    </p>
                    <p>
                        {about?.paragraph2 || "We believe that every piece of jewelry tells a story. Whether it's a custom engagement ring or a timeless necklace, we pour our heart and soul into every creation."}
                    </p>
                </div>
            </FadeIn>
         </div>

         {/* Image Section - Now on Right */}
         <div className="md:col-span-7 lg:col-span-7">
            <FadeIn direction="left">
                <div className="aspect-[3/2] bg-gray-100 overflow-hidden rounded-sm shadow-xl">
                    <img 
                        src={about?.image || '/images/home-hero-model.jpg'} 
                        alt="About Us" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </FadeIn>
         </div>
      </div>
    </div>
  );
};

export default About;
