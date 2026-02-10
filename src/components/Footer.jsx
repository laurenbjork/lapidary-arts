import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, CreditCard } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Footer = () => {
  const { content } = useContent();
  const { socials, footer } = content;

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
              <form className="flex border-b border-white/20">
                <input 
                  type="email" 
                  placeholder="EMAIL" 
                  className="bg-transparent w-full py-2 text-[10px] uppercase tracking-widest text-white placeholder-white/40 focus:outline-none"
                />
                <button className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors ml-2">
                  →
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
    </footer>
  );
};

export default Footer;
