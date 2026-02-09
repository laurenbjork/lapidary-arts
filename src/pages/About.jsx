import React from 'react';

const About = () => {
  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">About Lapidary Art</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">A legacy of craftsmanship and passion for fine jewelry.</p>
      </div>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-600 mb-6 leading-relaxed">
            Lapidary Art Jewelry was founded with a simple mission: to create breathtaking jewelry that celebrates life's most precious moments. 
            Our team of master jewelers and designers are dedicated to the highest standards of quality and artistry.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
            We believe that every piece of jewelry tells a story. Whether it's a custom engagement ring or a timeless necklace, 
            we pour our heart and soul into every creation.
        </p>
      </div>
    </div>
  );
};

export default About;
