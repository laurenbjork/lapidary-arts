import React from 'react';
import FadeIn from '../components/FadeIn';

const FAQ = () => {
  const faqs = [
    {
      question: "Do you offer shipping?",
      answer: "We are currently a gallery-only showroom. All purchases must be made in-store at our Plano, TX location."
    },
    {
      question: "Can I book a private appointment?",
      answer: "Yes, we offer private consultations for custom designs and viewing our collection. Please contact us to schedule."
    },
    {
      question: "Do you offer jewelry repair?",
      answer: "Yes, we have master jewelers on-site who can assist with repairs, resizing, and restoration."
    },
    {
      question: "What is your return policy?",
      answer: "Please contact our showroom directly for information regarding returns and exchanges on in-store purchases."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Frequently Asked Questions</h1>
      </FadeIn>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <FadeIn key={index} delay={index * 0.1} className="border-b border-gray-100 pb-8">
            <h3 className="font-serif text-xl text-gray-900 mb-3">{faq.question}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
