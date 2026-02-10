import React from 'react';
import FadeIn from '../components/FadeIn';

const Accessibility = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Accessibility</h1>
      </FadeIn>

      <FadeIn className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Our Commitment</h2>
          <p>
            Lapidary Arts Jewelry is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of the Lapidary Arts Jewelry website. 
            Please let us know if you encounter accessibility barriers on our site by contacting us at our showroom.
          </p>
        </section>
      </FadeIn>
    </div>
  );
};

export default Accessibility;
