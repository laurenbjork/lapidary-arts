import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';
import { useCart } from '../context/CartContext';

const shopMenu = {
  RINGS: ['All Rings', 'Stacks and Bands', 'Dome Rings', 'Double Band Rings', 'Diamond Bands', 'Bridal & Engagement'],
  NECKLACES: ['All Necklaces', 'Chokers', 'Pendant', 'Tennis', 'Lariat', 'Disk and Coins'],
  EARRINGS: ['All Earrings', 'Hoops & Huggies', 'Studs', 'Ear Bands & Cuffs'],
  STONE: ['Emerald', 'Topaz', 'Sapphire', 'Spinel', 'Pearl', 'Opal', 'Tourmaline', 'Ruby', 'Garnet']
};



const giftingMenu = [
  "Valentine's Day Gift Guide", 'Daughters', 'Lovers', 'Friend', 'Mamas', 'The Minimalist', 'The Maximalist',
  'Second Skin', 'Bridal Jewelry', 'Best Sellers', '$500 and under', 'LS HOME', 'LS x Amber Lewis Gift Sets'
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { setIsCartOpen, cartCount } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDarkHeader = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-40 transition-all duration-500 ${
          isDarkHeader ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-white'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <AnnouncementBar />
        <div className={`max-w-[1920px] mx-auto px-6 flex justify-between items-center relative transition-all duration-500 ${
          isDarkHeader ? 'py-2' : 'py-2'
        }`}>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo - Left Aligned on Desktop */}
          <Link to="/" className="text-2xl font-serif tracking-tighter">
            <img 
              src={isDarkHeader ? "/images/logo.png" : "/images/Home.png"}
              alt="Lapidary Art" 
              className="w-[130px] h-auto max-h-[45px] object-contain transition-all duration-300"
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

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8 text-[11px] font-medium uppercase tracking-[0.15em] h-full">
            <Link to="/new-arrivals" className="hover:opacity-70 transition-opacity py-3">New Arrivals</Link>
            
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('shop')}
            >
              <Link to="/shop" className="hover:opacity-70 transition-opacity py-3 flex items-center">
                Shop <ChevronDown size={12} className="ml-1" />
              </Link>
            </div>

            <Link to="/watches" className="hover:opacity-70 transition-opacity py-3">Watches</Link>
            


            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('gifting')}
            >
              <Link to="/gifts" className="hover:opacity-70 transition-opacity py-3 flex items-center">
                Gifting <ChevronDown size={12} className="ml-1" />
              </Link>
            </div>


            <Link to="/about" className="hover:opacity-70 transition-opacity py-3">About</Link>
          </div>

          {/* Icons - Right Aligned */}
          <div className="flex items-center space-x-6">
            <Search size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <User size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <div 
              className="relative cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-[#bfa095] text-white text-[9px] w-3 h-3 flex items-center justify-center rounded-full">{cartCount}</span>
            </div>
          </div>
        </div>

        {/* Dropdowns */}
        <AnimatePresence>
          {activeDropdown === 'shop' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white text-gray-900 border-t border-gray-100 shadow-lg py-12 px-6 z-50"
              onMouseEnter={() => handleMouseEnter('shop')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
                {Object.entries(shopMenu).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4">{category}</h3>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item}>
                          <Link to={`/shop/${item.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] text-gray-600 hover:text-black uppercase tracking-wider transition-colors">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}



          {activeDropdown === 'gifting' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-[50%] transform -translate-x-1/2 bg-white text-gray-900 border-t border-gray-100 shadow-lg py-6 px-8 z-50 min-w-[250px]"
              onMouseEnter={() => handleMouseEnter('gifting')}
              onMouseLeave={handleMouseLeave}
            >
              <ul className="space-y-3">
                {giftingMenu.map((item) => (
                  <li key={item}>
                    <Link to={`/gifts/${item.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] text-gray-600 hover:text-black uppercase tracking-wider transition-all duration-300 block hover:translate-x-1">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 md:hidden pt-20 px-6"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6">
              <X size={24} className="text-black" />
            </button>
            <div className="flex flex-col space-y-6 text-black text-sm uppercase tracking-widest font-medium">
              <Link to="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link to="/watches" onClick={() => setIsMobileMenuOpen(false)}>Watches</Link>

              <Link to="/designers" onClick={() => setIsMobileMenuOpen(false)}>Designers</Link>
              <Link to="/gifts" onClick={() => setIsMobileMenuOpen(false)}>Gifts</Link>
              <Link to="/lifestyle" onClick={() => setIsMobileMenuOpen(false)}>Lifestyle</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
