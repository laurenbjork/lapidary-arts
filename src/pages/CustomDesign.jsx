import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import ConsultationModal from '../components/ConsultationModal';

const CustomDesign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">Custom Design</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">Create something as unique as you are.</p>
      </FadeIn>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <img src="/images/custom-design-feature.jpg" alt="Custom Design Process" className="w-full h-auto" />
          </FadeIn>
          <FadeIn direction="left">
             <h2 className="font-serif text-2xl mb-4 italic">The Process</h2>
             <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Our custom design process allows you to work one-on-one with our designers to create the jewelry of your dreams.
             </p>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors"
             >
                Book a Consultation
             </button>
          </FadeIn>
       </div>
       
       <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CustomDesign;
