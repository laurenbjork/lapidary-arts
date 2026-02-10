import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ChevronLeft, ChevronRight, Star, MapPin, Phone, Clock } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/" className="text-burgundy border-b border-burgundy pb-1">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Image Gallery Section */}
        <FadeIn className="space-y-4">
          <div className="aspect-square bg-gray-50 overflow-hidden rounded-sm relative group">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
            ))}
          </div>
        </FadeIn>

        {/* Product Info Section */}
        <FadeIn delay={0.2} className="flex flex-col">
          <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">{product.category}</div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-xl text-gray-900">${product.price.toLocaleString()}</div>
            <div className="flex items-center text-yellow-500 text-xs">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <span className="text-gray-400 ml-2">(12 Reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-8">
            <button className="w-full border border-gray-900 text-gray-900 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-black hover:text-white transition-colors">
                Book a Virtual Appointment
            </button>
          </div>

          <div className="space-y-4 text-xs text-gray-500">
            <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span>Available for in-store pickup at our downtown location.</span>
            </div>
            <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span>Call us to confirm availability: (123) 456-7890</span>
            </div>
            <div className="flex items-center space-x-3">
                <Clock size={16} />
                <span>Store hours: Mon-Sat 10 AM - 6 PM</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Details Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center space-x-8 border-b border-gray-200 mb-10">
            {['description', 'details', 'in-store'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs uppercase tracking-widest transition-colors ${
                        activeTab === tab ? 'border-b-2 border-burgundy text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
        
        <div className="text-center text-sm text-gray-600 leading-relaxed min-h-[200px]">
            {activeTab === 'description' && (
                <FadeIn>
                    <p>
                        Every piece in our collection is a testament to the artistry of fine jewelry making. 
                        Hand-selected gemstones are set in precious metals by our master artisans in Los Angeles.
                        This piece specifically embodies the balance between timeless elegance and modern design.
                    </p>
                </FadeIn>
            )}
            {activeTab === 'details' && (
                <FadeIn>
                    <ul className="space-y-2 inline-block text-left">
                        <li>• 18k Solid Gold</li>
                        <li>• Ethically sourced diamonds</li>
                        <li>• Handcrafted in Los Angeles</li>
                        <li>• Total Carat Weight: 1.2ct</li>
                    </ul>
                </FadeIn>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;