import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { addNewsletterSignup, content } = useContent();
  const { newsletterPopup } = content;
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    countryCode: 'US'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has already seen/closed/signed up
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_popup_seen', 'true');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const signupData = {
        id: Date.now().toString(),
        email: formData.email,
        phone: formData.phone,
        country: formData.countryCode,
        signedUpAt: new Date().toISOString()
      };

      await addNewsletterSignup(signupData);
      
      // Mark as seen so it doesn't show again
      localStorage.setItem('newsletter_popup_seen', 'true');
      setIsVisible(false);
      // Optional: Show success toast
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[800px] h-auto md:h-[500px] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-48 md:h-full bg-gray-100 relative">
          <img 
            src={newsletterPopup?.leftImage || "/images/necklace-2.jpg"} 
            alt="Jewelry" 
            className="w-full h-full object-cover"
          />
          {/* Logo Overlay on Image (Bottom Left) */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-white">
             <h2 className="text-xl font-serif tracking-widest uppercase font-bold drop-shadow-md">
                {newsletterPopup?.leftTitle || "LULU"}
             </h2>
             <p className="text-[10px] tracking-[0.3em] uppercase drop-shadow-md">
                {newsletterPopup?.leftSubtitle || "Los Angeles"}
             </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center bg-white">
          {/* Logo (Top Center) */}
          <div className="mb-6 flex flex-col items-center">
             {newsletterPopup?.rightLogoImage ? (
                <img src={newsletterPopup.rightLogoImage} alt="Logo" className="h-12 w-auto object-contain" />
             ) : (
                <span className="font-serif text-3xl italic font-medium mb-1">LS</span>
             )}
          </div>

          <h2 className="font-serif text-2xl md:text-3xl text-burgundy italic mb-4">Don't miss a thing</h2>
          
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 leading-relaxed px-4">
            Sign up for new arrivals, exclusive offers, events and more.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="ENTER EMAIL"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-black uppercase placeholder-gray-400"
            />
            
            <div className="flex border border-gray-300 focus-within:border-black">
              <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                <span className="text-lg">🇺🇸</span>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 text-xs tracking-wide focus:outline-none uppercase placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8B5E5E] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#7A5252] transition-colors flex justify-center items-center"
            >
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : 'SIGN UP.'}
            </button>
          </form>

          <div className="mt-6 text-[9px] text-gray-400 leading-tight text-left px-2">
            <p>
              You consent to receive marketing text messages. Message and data rates may apply. 
              You can unsubscribe at any time by replying STOP or clicking the unsubscribe link. 
              View our <a href="#" className="underline hover:text-gray-600">Privacy Policy</a> and <a href="#" className="underline hover:text-gray-600">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
