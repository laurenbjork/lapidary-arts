import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

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
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState(null);
  const [mobileShopCategoryOpen, setMobileShopCategoryOpen] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { setIsCartOpen, cartCount } = useCart();
  const { products } = useProducts();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDarkHeader = isScrolled || !isHome || isSearchOpen;

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

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
        const query = searchQuery.toLowerCase();
        const matches = products.filter(p => 
            p.isVisible && (
                p.name.toLowerCase().includes(query) || 
                (p.category && p.category.toLowerCase().includes(query))
            )
        ).slice(0, 5); // Limit to 5 suggestions
        setSuggestions(matches);
    } else {
        setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSuggestions([]);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (productName) => {
    navigate(`/shop?search=${encodeURIComponent(productName)}`);
    setIsSearchOpen(false);
    setSuggestions([]);
    setSearchQuery('');
  };

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-40 transition-all duration-500 ${
          isDarkHeader ? 'bg-white/50 backdrop-blur-md text-gray-900 shadow-sm' : 'bg-transparent text-white'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <AnnouncementBar />
        <div className={`max-w-[1920px] mx-auto px-6 flex justify-between items-center relative transition-all duration-500 ${
          isDarkHeader ? 'py-2' : 'py-2'
        }`}>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo - Left Aligned on Desktop, Centered on Mobile */}
          <div className="absolute left-0 right-0 flex justify-center md:static md:flex-1 md:justify-start items-center pointer-events-none md:pointer-events-auto md:-ml-[80px]">
            <Link to="/" className="flex items-center text-2xl font-serif tracking-tighter pointer-events-auto">
                <img 
                src={isDarkHeader ? "/images/logo.png" : "/images/Home.png"}
                alt="Lapidary Art" 
                className="w-[240px] md:w-[400px] h-auto max-h-[120px] md:max-h-[150px] object-contain transition-all duration-300"
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

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center space-x-8 text-[11px] font-medium uppercase tracking-[0.15em] h-full">
            {!isSearchOpen ? (
                <>
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
                    
                    <Link to="/custom-design" className="hover:opacity-70 transition-opacity py-3">Custom Designs</Link>

                    <Link to="/about" className="hover:opacity-70 transition-opacity py-3">About</Link>
                </>
            ) : (
                <div className="relative">
                    <form onSubmit={handleSearchSubmit} className="w-[500px] flex items-center justify-center">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Search for products..." 
                            className={`w-full bg-transparent border-b ${isDarkHeader ? 'border-gray-800 placeholder-gray-500' : 'border-white placeholder-gray-300'} py-2 text-center focus:outline-none transition-colors text-sm tracking-widest uppercase`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // Delay hiding to allow click
                            onBlur={() => setTimeout(() => !searchQuery && setIsSearchOpen(false), 200)} 
                        />
                        <button type="submit" className="hidden">Search</button>
                        <X 
                            size={16} 
                            className="ml-4 cursor-pointer hover:opacity-70" 
                            onClick={() => setIsSearchOpen(false)}
                        />
                    </form>
                    
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white/70 backdrop-blur-md text-gray-900 border border-gray-100/50 shadow-lg mt-1 max-h-[300px] overflow-y-auto z-50">
                            {suggestions.map((product) => (
                                <div 
                                    key={product.id}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors text-left"
                                    onClick={() => handleSuggestionClick(product.name)}
                                >
                                    <div className="w-10 h-10 bg-gray-100 flex-shrink-0 overflow-hidden">
                                        <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider">{product.name}</p>
                                        <p className="text-[9px] text-gray-500 uppercase">{product.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Icons - Right Aligned */}
          <div className="flex-1 flex justify-end items-center space-x-6">
            <Search 
                size={20} 
                className="cursor-pointer hover:opacity-70 transition-opacity" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            {/* User Icon Removed */}
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
              className="absolute top-full left-0 w-full bg-white/70 backdrop-blur-md text-gray-900 border-t border-gray-100/50 shadow-lg py-12 px-6 z-50"
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
                          <Link 
                            to={`/shop/${item.toLowerCase().replace(/ /g, '-')}`} 
                            className="text-[11px] text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
                            onClick={handleLinkClick}
                          >
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
              className="absolute top-full left-[50%] transform -translate-x-1/2 bg-white/70 backdrop-blur-md text-gray-900 border-t border-gray-100/50 shadow-lg py-6 px-8 z-50 min-w-[250px]"
              onMouseEnter={() => handleMouseEnter('gifting')}
              onMouseLeave={handleMouseLeave}
            >
              <ul className="space-y-3">
                {giftingMenu.map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/gifts/${item.toLowerCase().replace(/ /g, '-')}`} 
                      className="text-[11px] text-gray-600 hover:text-black uppercase tracking-wider transition-all duration-300 block hover:translate-x-1"
                      onClick={handleLinkClick}
                    >
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
            <div className="flex flex-col space-y-6 text-black text-sm uppercase tracking-widest font-medium overflow-y-auto max-h-[85vh] pb-20 hide-scrollbar">
               {/* Search in Mobile Menu */}
               <form onSubmit={handleSearchSubmit} className="relative w-full border-b border-gray-200 pb-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="SEARCH" 
                    className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-0 top-0">
                    <Search size={16} className="text-gray-400" />
                  </button>
               </form>

              <Link to="/new-arrivals" onClick={handleLinkClick}>New Arrivals</Link>
              
              {/* Shop Accordion */}
              <div>
                <button 
                  onClick={() => setMobileOpenSubmenu(mobileOpenSubmenu === 'shop' ? null : 'shop')}
                  className="flex items-center justify-between w-full"
                >
                  Shop 
                  {mobileOpenSubmenu === 'shop' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {mobileOpenSubmenu === 'shop' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 pt-4 space-y-4 border-l border-gray-100 mt-2"
                    >
                         {Object.entries(shopMenu).map(([category, items]) => (
                              <div key={category} className="space-y-2">
                                <button 
                                  onClick={() => setMobileShopCategoryOpen(mobileShopCategoryOpen === category ? null : category)}
                                  className="flex items-center justify-between w-full text-[10px] font-bold text-gray-500 tracking-widest uppercase hover:text-black transition-colors"
                                >
                                  {category}
                                  {mobileShopCategoryOpen === category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                
                                <AnimatePresence>
                                  {mobileShopCategoryOpen === category && (
                                    <motion.ul
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden pl-2 space-y-3 pt-2"
                                    >
                                      {items.map((item) => (
                                        <li key={item}>
                                          <Link 
                                            to={`/shop/${item.toLowerCase().replace(/ /g, '-')}`} 
                                            className="text-[11px] text-gray-600 block hover:text-black transition-colors"
                                            onClick={handleLinkClick}
                                          >
                                            {item}
                                          </Link>
                                        </li>
                                      ))}
                                    </motion.ul>
                                  )}
                                </AnimatePresence>
                              </div>
                         ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/watches" onClick={handleLinkClick}>Watches</Link>

              {/* Gifting Accordion */}
              <div>
                <button 
                  onClick={() => setMobileOpenSubmenu(mobileOpenSubmenu === 'gifting' ? null : 'gifting')}
                  className="flex items-center justify-between w-full"
                >
                  Gifting
                  {mobileOpenSubmenu === 'gifting' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {mobileOpenSubmenu === 'gifting' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 pt-4 space-y-3 border-l border-gray-100 mt-2"
                    >
                         {giftingMenu.map((item) => (
                            <Link 
                                key={item}
                                to={`/gifts/${item.toLowerCase().replace(/ /g, '-')}`} 
                                className="text-[11px] text-gray-600 block hover:text-black transition-colors"
                                onClick={handleLinkClick}
                            >
                                {item}
                            </Link>
                         ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/custom-design" onClick={handleLinkClick}>Custom Designs</Link>
              <Link to="/about" onClick={handleLinkClick}>About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50 md:hidden pt-24 px-6"
          >
            <button 
                onClick={() => setIsSearchOpen(false)} 
                className="absolute top-6 right-6 p-2"
            >
              <X size={24} className="text-black" />
            </button>
            
            <form onSubmit={handleSearchSubmit} className="w-full">
                <input 
                    type="text" 
                    autoFocus
                    placeholder="SEARCH PRODUCTS..." 
                    className="w-full border-b border-gray-900 py-4 text-xl font-serif text-center uppercase tracking-widest focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            {/* Mobile Search Suggestions */}
            {suggestions.length > 0 && (
                <div className="mt-8 space-y-4">
                    {suggestions.map((product) => (
                        <div 
                            key={product.id}
                            className="flex items-center gap-4 p-2 border-b border-gray-50 pb-4"
                            onClick={() => handleSuggestionClick(product.name)}
                        >
                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                                <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-medium uppercase tracking-wider">{product.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
