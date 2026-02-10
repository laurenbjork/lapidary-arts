import React from 'react';
import FadeIn from '../components/FadeIn';

const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Privacy Policy</h1>
      </FadeIn>

      <FadeIn className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Overview</h2>
          <p>
            Lapidary Arts Jewelry respects your privacy and is committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Information We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            Identity Data, Contact Data, Technical Data, and Usage Data. We do not collect any Special Categories of Personal Data about you.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            <br/>- Where we need to perform the contract we are about to enter into or have entered into with you.
            <br/>- Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at our showroom.
          </p>
        </section>
      </FadeIn>
    </div>
  );
};

export default PrivacyPolicy;
