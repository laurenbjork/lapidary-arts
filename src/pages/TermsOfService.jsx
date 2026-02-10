import React from 'react';
import FadeIn from '../components/FadeIn';

const TermsOfService = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl text-gray-900 mb-6 italic">Terms of Service</h1>
      </FadeIn>

      <FadeIn className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">General Conditions</h2>
          <p>
            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), 
            may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Accuracy, Completeness and Timeliness of Information</h2>
          <p>
            We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only 
            and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Modifications to the Service and Prices</h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-gray-900 mb-4">Products or Services</h2>
          <p>
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
          </p>
        </section>
      </FadeIn>
    </div>
  );
};

export default TermsOfService;
