import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import ConsultationModal from '../components/ConsultationModal';
import { useContent } from '../context/ContentContext';

const CustomDesign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { content } = useContent();
  const { customDesignPage } = content;

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">{customDesignPage?.title || "Custom Design"}</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">Create something as unique as you are.</p>
      </FadeIn>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <FadeIn direction="right">
            <img src={customDesignPage?.image || "/images/custom-design-feature.jpg"} alt={customDesignPage?.title || "Custom Design Process"} className="w-full h-auto" />
          </FadeIn>
          <FadeIn direction="left">
             <h2 className="font-serif text-2xl mb-4 italic">The Process</h2>
             <p className="text-gray-600 mb-10 leading-relaxed text-sm">
                {customDesignPage?.description || "Our custom design process allows you to work one-on-one with our designers to create the jewelry of your dreams."}
             </p>

             <div className="space-y-8 mb-10">
                {(customDesignPage?.steps || [
                  { title: 'Personal Consultation', description: 'Begin with an intimate discussion of your vision and preferences' },
                  { title: 'Expert Design', description: 'Our artisans create detailed renderings for your approval' },
                  { title: 'Masterful Craftsmanship', description: 'Watch as your dream piece is meticulously handcrafted' }
                ]).map((step, index) => (
                  <div key={index} className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-burgundy text-white flex items-center justify-center font-serif text-lg flex-shrink-0 mr-4 mt-1">
                          {index + 1}
                      </div>
                      <div>
                          <h3 className="font-serif text-xl text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                      </div>
                  </div>
                ))}
             </div>

             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors"
             >
                {customDesignPage?.buttonText || "Book a Consultation"}
             </button>
          </FadeIn>
       </div>
       
       <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CustomDesign;
