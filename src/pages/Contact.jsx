import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader, CheckCircle } from 'lucide-react';
import { useInquiries } from '../context/InquiryContext';

const Contact = () => {
  const { addInquiry } = useInquiries();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
        const inquiryData = {
            name: formData.name,
            email: formData.email,
            description: formData.message,
            type: 'contact'
        };

        const result = await addInquiry(inquiryData);
        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } else {
            throw new Error(result.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        setStatus('error');
    }
  };

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
                <div className="flex items-start text-gray-600">
                    <Mail className="mr-4 text-burgundy mt-1" />
                    <div className="flex flex-col">
                        <a href="mailto:lauren@lapidaryartsjewelry.com" className="hover:text-black">lauren@lapidaryartsjewelry.com</a>
                        <a href="mailto:rania@lapidaryartsjewelry.com" className="hover:text-black">rania@lapidaryartsjewelry.com</a>
                    </div>
                </div>
                <div className="flex items-center text-gray-600">
                    <Phone className="mr-4 text-burgundy" />
                    <a href="tel:9729641090" className="hover:text-black">(972) 964-1090</a>
                </div>
                <div className="flex items-center text-gray-600">
                    <MapPin className="mr-4 text-burgundy" />
                    <span>3400 Preston Rd #250, Plano, TX 75093</span>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-serif text-lg mb-4">Store Hours</h3>
                <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex justify-between"><span>Monday - Friday</span> <span>10:00 AM - 6:00 PM</span></p>
                    <p className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></p>
                    <p className="flex justify-between"><span>Sunday</span> <span>Closed</span></p>
                </div>
            </div>
        </div>

        <div>
             <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
             {status === 'success' ? (
                 <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                     <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                     <h3 className="text-xl font-serif text-green-800 mb-2">Message Sent!</h3>
                     <p className="text-green-700">Thank you for contacting us. We will get back to you shortly.</p>
                     <button 
                        onClick={() => setStatus('idle')}
                        className="mt-6 text-sm underline text-green-800 hover:text-green-900"
                     >
                        Send another message
                     </button>
                 </div>
             ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Name</label>
                         <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none" 
                         />
                     </div>
                     <div>
                         <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Email</label>
                         <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none" 
                         />
                     </div>
                     <div>
                         <label className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Message</label>
                         <textarea 
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 focus:border-burgundy focus:outline-none h-32"
                         ></textarea>
                     </div>
                     <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="bg-burgundy text-white px-8 py-3 uppercase tracking-widest hover:bg-burgundy-dark transition-colors w-full flex justify-center items-center disabled:opacity-70"
                     >
                         {status === 'submitting' ? <Loader className="animate-spin" size={20} /> : 'Send Message'}
                     </button>
                 </form>
             )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
