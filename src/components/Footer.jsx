import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-16">
          
          {/* Newsletter */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-8">
              <img 
                src="/images/Home.png" 
                alt="Lapidary Art" 
                className="h-16 mx-auto"
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
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-white">Stay Connected</h4>
            <form className="flex flex-col space-y-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-b border-gray-700 px-0 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                />
                <button className="text-left text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  Subscribe
                </button>
            </form>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-white">Customer Care</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-white">About</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-400">
              <li><Link to="/our-story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 text-white">Policies</h4>
            <ul className="space-y-3 text-[11px] uppercase tracking-wider text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] uppercase tracking-widest">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" className="h-2 opacity-50" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" className="h-3 opacity-50" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-3 opacity-50" alt="PayPal" />
          </div>
          <p>&copy; {new Date().getFullYear()} Lapidary Art Jewelry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
