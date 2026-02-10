import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, CreditCard, Loader, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Footer = () => {
  const { content, addNewsletterSignup } = useContent();
  const { socials, footer } = content;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setShowConsentModal(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!consent) return;

    setStatus('submitting');
    setShowConsentModal(false);
    
    try {
      await addNewsletterSignup({ email, country: 'US' });
      setStatus('success');
      setEmail('');
      setConsent(false);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Footer signup error:', error);
      setStatus('error');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-gray-900 py-2">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-4 items-start">
          
          {/* 1. Brand Logo (Standalone, Bigger) */}
          <div className="lg:col-span-3 flex items-start">
            <Link to="/" className="block ml-24">
              <img 
                src={footer?.logo || "/images/Home.png"} 
                alt="Lapidary Art" 
                className="h-56 object-contain"
                onError={(e) => { 
                  const target = e.target;
                  if (target.src.includes('Home.png')) {
                    target.src = '/images/logo.png';
                  } else if (target.src.includes('logo.png')) {
                    target.src = '/images/logo.svg';
                  }
                }}
              />
            </Link>
          </div>

          {/* 2. Visit Us Info (Moved from under logo) */}
          <div className="lg:col-span-3 mt-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-4">Visit Us</h4>
            <div className="text-[10px] uppercase tracking-widest text-white/70 space-y-2">
              <a 
                href="https://www.google.com/maps/place/Lapidary+Arts+Jewelry/@33.0438912,-96.7952452,17z/data=!3m1!4b1!4m6!3m5!1s0x864c231d9230520d:0xd142bddd86568891!8m2!3d33.0438912!4d-96.7926703!16s%2Fg%2F1tg4x7cb?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors leading-relaxed"
              >
                3400 Preston Rd #250<br/>Plano, TX 75093
              </a>
              <a href="tel:9729641090" className="block hover:text-white transition-colors">
                (972) 964-1090
              </a>
              <div className="text-white/50 space-y-1">
                <p>Mon-Fri 10-6 • Sat 10-4</p>
                <p>Sun Closed</p>
              </div>
            </div>
          </div>

          {/* 3. Explore Links */}
          <div className="lg:col-span-2 mt-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-[10px] uppercase tracking-wider text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* 4. Legal Links */}
          <div className="lg:col-span-2 mt-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-[10px] uppercase tracking-wider text-white/60">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* 5. Connect (Newsletter + Socials) */}
          <div className="lg:col-span-2 space-y-6 mt-10">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-4">Newsletter</h4>
              <form onSubmit={handleInitialSubmit} className="flex border-b border-white/20">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={status === 'success' ? 'SIGNED UP!' : 'EMAIL'}
                  disabled={status === 'submitting' || status === 'success'}
                  className="bg-transparent w-full py-2 text-[10px] uppercase tracking-widest text-white placeholder-white/40 focus:outline-none disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'submitting' || status === 'success'}
                  className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors ml-2 disabled:opacity-50"
                >
                  {status === 'submitting' ? <Loader size={12} className="animate-spin" /> : '→'}
                </button>
              </form>
            </div>
            
            <div className="flex gap-4">
              {socials?.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                      <Instagram size={18} strokeWidth={1.5} />
                  </a>
              )}
              {socials?.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                      <Facebook size={18} strokeWidth={1.5} />
                  </a>
              )}
              <a href="mailto:info@lapidaryarts.com" className="text-white/60 hover:text-white transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] uppercase tracking-widest text-white/40">
            &copy; {new Date().getFullYear()} Lapidary Arts Jewelry. All rights reserved.
          </p>
          <div className="flex items-center space-x-3 opacity-30 grayscale">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" className="h-2" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" className="h-3" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-3" alt="PayPal" />
          </div>
        </div>

      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setShowConsentModal(false)}
            />
            <div className="relative bg-white p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={() => setShowConsentModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black"
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-xl font-serif mb-2">Almost there</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Please confirm your subscription to our newsletter.
                </p>

                <div className="flex items-start space-x-3 mb-6">
                    <input
                        type="checkbox"
                        id="footer-consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-burgundy focus:ring-burgundy"
                    />
                    <label htmlFor="footer-consent" className="text-xs text-gray-500 leading-relaxed">
                        I agree to receive marketing emails from Lapidary Arts. I understand I can unsubscribe at any time. 
                        By signing up, you agree to our <Link to="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
                    </label>
                </div>

                <button
                    onClick={handleConfirmedSubmit}
                    disabled={!consent}
                    className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                        !consent 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                    Confirm Subscription
                </button>
            </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
