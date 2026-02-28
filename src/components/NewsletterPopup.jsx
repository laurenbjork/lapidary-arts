import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { useInquiries } from '../context/InquiryContext';
import { useContent } from '../context/ContentContext';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { addInquiry } = useInquiries();
  const { content } = useContent();
  const { newsletterPopup } = content;
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    countryCode: 'US',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    const { name, value, type, checked } = e.target;
    setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
        alert("Please agree to receive marketing communications.");
        return;
    }
    setIsSubmitting(true);

    try {
      const inquiryData = {
        name: 'Newsletter Signup',
        email: formData.email,
        phone: formData.phone,
        description: `Consented to marketing: ${formData.consent}`,
        type: 'newsletter'
      };

      const result = await addInquiry(inquiryData);

      if (result && result.success) {
        setIsSuccess(true);
        localStorage.setItem('newsletter_popup_seen', 'true');
        setTimeout(() => {
          handleClose();
        }, 3000); // Auto-close after 3 seconds
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to sign up. Please try again.');
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
                {newsletterPopup?.leftTitle || "Lapidary Arts"}
             </h2>
             <p className="text-[10px] tracking-[0.3em] uppercase drop-shadow-md">
                  Jewelry
               </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center bg-white">
          {isSuccess ? (
            <div className="text-center">
              <h2 className="font-serif text-2xl md:text-3xl text-burgundy italic mb-4">Thank You!</h2>
              <p className="text-sm text-gray-600">You've been added to our newsletter.</p>
            </div>
          ) : (
            <>
              {/* Logo (Top Center) */}
              <div className="mb-6 flex flex-col items-center">
                {newsletterPopup?.rightLogoImage ? (
                    <img src={newsletterPopup.rightLogoImage} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                    <span className="font-serif text-3xl italic font-medium mb-1">LS</span>
                )}
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-burgundy italic mb-4">
                  {newsletterPopup?.popupTitle || "Don't miss a thing"}
              </h2>
              
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 leading-relaxed px-4">
                {newsletterPopup?.popupDescription || "Sign up for new arrivals, exclusive offers, events and more."}
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

                <div className="flex items-start space-x-2 my-2">
                    <input
                        type="checkbox"
                        name="consent"
                        id="popup-consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1 h-3 w-3 rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        required
                    />
                    <label htmlFor="popup-consent" className="text-[10px] text-gray-500 leading-tight text-left">
                        I agree to receive marketing emails from Lapidary Arts. I understand I can unsubscribe at any time.
                    </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.consent}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center ${
                      !formData.consent 
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                        : 'bg-[#8B5E5E] text-white hover:bg-[#7A5252]'
                  }`}
                >
                  {isSubmitting ? <Loader size={16} className="animate-spin" /> : 'SIGN UP.'}
                </button>
              </form>

              <div className="mt-4 text-[9px] text-gray-400 leading-tight text-left px-2">
                <p>
                  By signing up, you agree to our <a href="#" className="underline hover:text-gray-600">Privacy Policy</a> and <a href="#" className="underline hover:text-gray-600">Terms of Service</a>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
