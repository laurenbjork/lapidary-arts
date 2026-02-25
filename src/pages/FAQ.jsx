import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const faqCategories = [
  {
    category: "Custom Jewelry Design",
    questions: [
      {
        question: "What is the process for a custom jewelry design?",
        answer: "Our custom design process begins with a personal consultation to discuss your vision. We then create detailed sketches and 3D renderings for your approval. Once the design is finalized, our master jewelers bring it to life, with meticulous attention to detail at every step."
      },
      {
        question: "How long does a custom piece take to create?",
        answer: "The timeline for a custom piece varies depending on complexity, but typically ranges from 4 to 8 weeks from design approval to final creation. We will provide a more precise timeline during your consultation."
      },
      {
        question: "Can you incorporate my own heirloom stones into a new design?",
        answer: "Absolutely. We specialize in reimagining heirloom jewelry. We can carefully remove your stones and set them into a new, modern design that reflects your personal style while honoring your heritage."
      },
    ]
  },
  {
    category: "Jewelry Care & Maintenance",
    questions: [
      {
        question: "How should I clean my fine jewelry at home?",
        answer: "For most fine jewelry, a simple solution of warm water and a few drops of mild dish soap is effective. Gently scrub with a soft-bristle toothbrush, rinse thoroughly, and pat dry with a lint-free cloth. For specific gemstones, please consult our detailed care guide or contact us."
      },
      {
        question: "How often should I have my jewelry professionally inspected?",
        answer: "We recommend a professional inspection and cleaning every 6 to 12 months. This allows us to check for any loose stones or wear and tear, ensuring the longevity of your cherished pieces."
      },
      {
        question: "Is it safe to wear my jewelry while swimming or exercising?",
        answer: "We advise against wearing fine jewelry during activities like swimming, exercising, or cleaning. Chemicals (like chlorine), sweat, and physical impact can damage metals and gemstones."
      },
    ]
  },
  {
    category: "Engagement & Wedding",
    questions: [
      {
        question: "What are the 4Cs of diamonds?",
        answer: "The 4Cs—Cut, Color, Clarity, and Carat—are the universal standard for grading diamond quality. We guide our clients through each 'C' to help them select a diamond that is perfect for them in both beauty and value."
      },
      {
        question: "Do you offer lab-grown diamonds?",
        answer: "Yes, we offer a curated selection of high-quality lab-grown diamonds, which are chemically and optically identical to natural diamonds. This provides a sustainable and often more accessible option for many clients."
      },
      {
        question: "Can you create a wedding band to perfectly match my engagement ring?",
        answer: "Yes, we specialize in creating custom-fit wedding bands that sit flush and complement the unique design of your engagement ring, whether it was purchased from us or not."
      },
    ]
  },
  {
    category: "Watches & General Inquiries",
    questions: [
      {
        question: "Do you service vintage watches like Rolex?",
        answer: "Yes, we have experienced watchmakers who specialize in the service and restoration of luxury vintage timepieces, including Rolex. We recommend servicing every 5-7 years to maintain its performance and value."
      },
      {
        question: "Are vintage watches water-resistant?",
        answer: "While many vintage watches were originally designed to be water-resistant, we strongly advise against exposing them to water. Gaskets can degrade over time, and it's best to err on the side of caution to protect the intricate movement."
      },
      {
        question: "What is your return policy?",
        answer: "For in-store purchases, we offer exchanges or store credit within 14 days. For custom pieces, all sales are final. Please contact our showroom for more detailed information."
      },
    ]
  }
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-serif text-lg text-gray-900">{question}</h3>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    )
  };

  return (
    <>
      <Helmet>
        <title>FAQ | Lapidary Arts Jewelry</title>
        <meta name="description" content="Find answers to common questions about custom jewelry design, engagement rings, jewelry care, vintage watches, and more at Lapidary Arts Jewelry." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Frequently Asked Questions</h1>
        </FadeIn>

        <div className="space-y-12">
          {faqCategories.map((category, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <h2 className="font-serif text-2xl text-gray-800 mb-4 border-l-4 border-burgundy pl-4">{category.category}</h2>
              <div className="space-y-2">
                {category.questions.map((faq, qIndex) => (
                  <FaqItem key={qIndex} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
