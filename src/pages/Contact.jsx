import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">We'd love to hear from you. Book an appointment or visit our showroom.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="bg-gray-50 p-8">
            <h2 className="font-serif text-2xl mb-6">Get in Touch</h2>
            <div className="space-y-6">
                <div className="flex items-center text-gray-600">
                    <Mail className="mr-4 text-burgundy" />
                    <span>hello@lapidaryart.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Phone className="mr-4 text-burgundy" />
                    <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <MapPin className="mr-4 text-burgundy" />
                    <span>123 Luxury Lane, Jewelry District, NY</span>
                </div>
            </div>
        </div>

        <div>
             <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
             <form className="space-y-4">
                 <div>
                     <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Name</label>
                     <input type="text" className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none" />
                 </div>
                 <div>
                     <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Email</label>
                     <input type="email" className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none" />
                 </div>
                 <div>
                     <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Message</label>
                     <textarea className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none h-32"></textarea>
                 </div>
                 <button className="bg-burgundy text-white px-8 py-3 uppercase tracking-widest hover:bg-burgundy-dark transition-colors w-full">
                     Send Message
                 </button>
             </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
