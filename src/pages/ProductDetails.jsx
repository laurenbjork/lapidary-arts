import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAppointments } from '../context/AppointmentContext';
import { ChevronLeft, ChevronRight, Star, MapPin, Phone, Clock, X } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { createAppointment } = useAppointments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(null);
  
  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    preferredTime: 'morning'
  });
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, submitting, success, error

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
        setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/" className="text-burgundy border-b border-burgundy pb-1">Return Home</Link>
      </div>
    );
  }

  const handleBookingChange = (e) => {
    setBookingForm({
        ...bookingForm,
        [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingStatus('submitting');
    
    const result = await createAppointment({
        ...bookingForm,
        product_id: product.id,
        product_name: product.name,
        stock_number: product.stockNumber
    });

    if (result.success) {
        setBookingStatus('success');
        setTimeout(() => {
            setIsBookingOpen(false);
            setBookingStatus('idle');
            setBookingForm({
                name: '',
                email: '',
                phone: '',
                description: '',
                preferredTime: 'morning'
            });
        }, 3000);
    } else {
        setBookingStatus('error');
    }
  };

  const galleryImages = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Image Gallery Section */}
        <FadeIn className="space-y-4">
          <div className="aspect-square bg-gray-50 overflow-hidden rounded-sm relative group">
             <img src={activeImage || product.image} alt={product.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, i) => (
                    <div 
                        key={i} 
                        onClick={() => setActiveImage(img)}
                        className={`aspect-square bg-gray-50 cursor-pointer transition-all ${
                            activeImage === img ? 'opacity-100 ring-1 ring-black' : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
          )}
        </FadeIn>

        {/* Product Info Section */}
        <FadeIn delay={0.2} className="flex flex-col">
          <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">{product.category}</div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">{product.name}</h1>
          {product.subTitle && (
            <h2 className="text-lg text-gray-500 font-light mb-2">{product.subTitle}</h2>
          )}
          {product.stockNumber && (
            <div className="text-xs text-gray-400 font-thin mb-4">Stock #: {product.stockNumber}</div>
          )}
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-xl text-gray-900">
                {product.hidePrice ? 'Price Upon Request' : `$${product.price.toLocaleString()}`}
            </div>
            {!product.hidePrice && (
            <div className="flex items-center text-yellow-500 text-xs">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <span className="text-gray-400 ml-2">(12 Reviews)</span>
            </div>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-6 mb-8 border-t border-b border-gray-100 py-8">
            <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full border border-gray-900 text-gray-900 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-black hover:text-white transition-colors"
            >
                Book Appointment
            </button>
          </div>

          <div className="space-y-4 text-xs text-gray-500">
            <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span>Call us to confirm availability: (972) 964-1090</span>
            </div>
            <div className="flex items-center space-x-3">
                <Clock size={16} />
                <span>Store hours: Mon-Fri 10-6 • Sat 10-4</span>
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
                        {product.details && product.details.length > 0 ? (
                            product.details.map((detail, index) => (
                                <li key={index}>• <span className="font-semibold">{detail.title}:</span> {detail.description}</li>
                            ))
                        ) : (
                            <>
                                <li>• 18k Solid Gold</li>
                                <li>• Ethically sourced diamonds</li>
                                <li>• Handcrafted in Los Angeles</li>
                                <li>• Total Carat Weight: 1.2ct</li>
                            </>
                        )}
                    </ul>
                </FadeIn>
            )}
            {activeTab === 'in-store' && (
                <FadeIn>
                    <div className="space-y-4">
                        {(!product.availabilityStatus || product.availabilityStatus === 'available') && (
                            <>
                                <p className="font-serif text-lg text-burgundy">This item is currently available.</p>
                                <p className="text-gray-600">Please contact us to verify availability and schedule a viewing.</p>
                            </>
                        )}
                        {product.availabilityStatus === 'special_order' && (
                            <>
                                <p className="font-serif text-lg text-burgundy">This item is special order only.</p>
                                <p className="text-gray-600">Please contact us for special orders.</p>
                            </>
                        )}
                        {product.availabilityStatus === 'out_of_stock' && (
                            <>
                                <p className="font-serif text-lg text-gray-500">This item is out of stock.</p>
                                <p className="text-gray-600">Please contact us for more options.</p>
                            </>
                        )}

                        <div className="text-gray-600 space-y-1 mt-6 border-t border-gray-100 pt-6">
                            <p className="font-semibold">Lapidary Arts Jewelry</p>
                            <p>3400 Preston Rd #250</p>
                            <p>Plano, TX 75093</p>
                            <a href="tel:9729641090" className="block hover:text-burgundy mt-2">(972) 964-1090</a>
                        </div>
                        <div className="text-gray-500 text-xs pt-2">
                            <p>Mon-Fri 10-6 • Sat 10-4</p>
                            <p>Sun Closed</p>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white p-8 max-w-md w-full rounded-lg relative">
                <button 
                    onClick={() => setIsBookingOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
                
                <h2 className="font-serif text-2xl mb-2 text-center">Book Appointment</h2>
                <p className="text-center text-xs text-gray-500 mb-6">
                    {product.name} {product.stockNumber && `(Stock #${product.stockNumber})`}
                </p>

                {bookingStatus === 'success' ? (
                    <div className="text-center py-8">
                        <div className="text-green-600 text-lg mb-2">Request Sent!</div>
                        <p className="text-gray-600 text-sm">
                            Someone will reach out soon during business hours to confirm your appointment.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Name</label>
                            <input 
                                type="text" 
                                name="name"
                                required
                                value={bookingForm.name}
                                onChange={handleBookingChange}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                required
                                value={bookingForm.email}
                                onChange={handleBookingChange}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</label>
                            <input 
                                type="tel" 
                                name="phone"
                                required
                                value={bookingForm.phone}
                                onChange={handleBookingChange}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Preferred Time</label>
                            <select 
                                name="preferredTime"
                                value={bookingForm.preferredTime}
                                onChange={handleBookingChange}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black bg-white"
                            >
                                <option value="morning">Morning (9AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 3PM)</option>
                                <option value="evening">Evening (3PM - 6PM)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Message (Optional)</label>
                            <textarea 
                                name="description"
                                value={bookingForm.description}
                                onChange={handleBookingChange}
                                rows="3"
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={bookingStatus === 'submitting'}
                            className="w-full bg-black text-white py-3 uppercase tracking-widest text-xs font-semibold hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50"
                        >
                            {bookingStatus === 'submitting' ? 'Sending...' : 'Request Appointment'}
                        </button>
                        
                        <p className="text-[10px] text-center text-gray-400 mt-4">
                            Someone will reach out soon during business hours.
                        </p>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;