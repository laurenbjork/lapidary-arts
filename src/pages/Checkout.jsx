import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Lock, CreditCard, Truck, CheckCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [taxRate, setTaxRate] = useState(0); // Default to 0 until zip is entered
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    zipCode: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardName) newErrors.cardName = 'Name on card is required';
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expDate) newErrors.expDate = 'Expiration date is required';
    if (!formData.cvc) newErrors.cvc = 'CVC is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        clearCart();
        setIsProcessing(false);
        navigate('/order-confirmation', { 
            state: { 
                orderId: Math.floor(Math.random() * 1000000),
                total: calculateTotal(),
                email: formData.email
            } 
        });
      }, 2000);
    } else {
        // Scroll to top to see errors if any
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const shippingCost = shippingMethod === 'standard' ? 0 : 25;
  const tax = cartTotal * taxRate;
  
  const calculateTotal = () => {
    return cartTotal + shippingCost + tax;
  };

  // Mock Tax Estimation Logic
  // In a real application, this would call an API like Stripe Tax, Avalara, or TaxJar
  useEffect(() => {
    const estimateTaxRate = (zip) => {
        // Clean zip
        const cleanZip = zip?.replace(/\D/g, '');
        if (!cleanZip || cleanZip.length < 5) {
            setTaxRate(0); // No tax if no valid zip
            return;
        }
        
        const zipPrefix = parseInt(cleanZip.substring(0, 3));
        
        // NY (100-149)
        if (zipPrefix >= 100 && zipPrefix <= 149) { setTaxRate(0.08875); return; }
        // CA (900-961)
        if (zipPrefix >= 900 && zipPrefix <= 961) { setTaxRate(0.095); return; }
        // TX (750-799)
        if (zipPrefix >= 750 && zipPrefix <= 799) { setTaxRate(0.0825); return; }
        // FL (320-349)
        if (zipPrefix >= 320 && zipPrefix <= 349) { setTaxRate(0.07); return; }
        // IL (600-629)
        if (zipPrefix >= 600 && zipPrefix <= 629) { setTaxRate(0.1025); return; }
        
        setTaxRate(0.06); // National Average Fallback
    };

    estimateTaxRate(formData.zipCode);
  }, [formData.zipCode]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Forms */}
        <FadeIn>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl text-gray-900">Checkout</h1>
              <Link to="/shop" className="text-xs text-gray-500 hover:text-black flex items-center">
                <ChevronLeft size={14} className="mr-1" /> Continue Shopping
              </Link>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-lg font-serif mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">1</span>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="newsletter" className="mr-2" />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">Email me with news and offers</label>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-lg font-serif mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Country / Region</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                      placeholder="Address"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Apartment, suite, etc. (optional)</label>
                    <input 
                      type="text" 
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">State</label>
                        <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">ZIP Code</label>
                        <input 
                        type="text" 
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full border ${errors.zipCode ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors`}
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="Optional - for shipping updates"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-lg font-serif mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">3</span>
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  <div 
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-black' : ''}`}>
                            {shippingMethod === 'standard' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Standard Shipping</p>
                            <p className="text-xs text-gray-500">5-7 Business Days</p>
                        </div>
                    </div>
                    <span className="text-sm font-medium">Free</span>
                  </div>

                  <div 
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setShippingMethod('express')}
                  >
                    <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border border-gray-400 mr-3 flex items-center justify-center ${shippingMethod === 'express' ? 'border-black' : ''}`}>
                            {shippingMethod === 'express' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Express Shipping</p>
                            <p className="text-xs text-gray-500">2-3 Business Days</p>
                        </div>
                    </div>
                    <span className="text-sm font-medium">$25.00</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-lg font-serif mb-6 flex items-center">
                  <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">4</span>
                  Payment
                </h2>
                
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-t-sm flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                        <CreditCard size={16} className="mr-2" /> Credit Card
                    </span>
                    <div className="flex space-x-2">
                        {/* Icons placeholders */}
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">MC</div>
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">AMEX</div>
                    </div>
                </div>
                
                <div className="p-6 border border-t-0 border-gray-200 rounded-b-sm bg-gray-50/30 space-y-4">
                    <div>
                        <input 
                          type="text" 
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="Card Number"
                          className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white`}
                        />
                         {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                        <input 
                          type="text" 
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="Name on Card"
                          className={`w-full border ${errors.cardName ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white`}
                        />
                        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input 
                              type="text" 
                              name="expDate"
                              value={formData.expDate}
                              onChange={handleChange}
                              placeholder="Expiration Date (MM/YY)"
                              className={`w-full border ${errors.expDate ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white`}
                            />
                            {errors.expDate && <p className="text-red-500 text-xs mt-1">{errors.expDate}</p>}
                        </div>
                        <div>
                            <input 
                              type="text" 
                              name="cvc"
                              value={formData.cvc}
                              onChange={handleChange}
                              placeholder="Security Code (CVC)"
                              className={`w-full border ${errors.cvc ? 'border-red-500' : 'border-gray-200'} p-3 text-sm focus:outline-none focus:border-black transition-colors bg-white`}
                            />
                            {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center text-gray-500 text-xs">
                    <Lock size={12} className="mr-1" />
                    Payments are secure and encrypted.
                </div>
              </div>

              {/* Mobile Place Order Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full lg:hidden bg-burgundy text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-burgundy-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay $${calculateTotal().toLocaleString()}`}
              </button>

            </form>
          </div>
        </FadeIn>

        {/* Right Column: Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit">
            <FadeIn delay={0.2} className="bg-gray-100 p-8 rounded-sm">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-white relative rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <span className="absolute -top-1 -right-1 bg-gray-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{item.quantity}</span>
                            </div>
                            <div className="flex-1 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shippingMethod === 'standard' ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Estimated Tax {taxRate > 0 && <span className="text-[10px] text-gray-400">({(taxRate * 100).toFixed(2)}%)</span>}</span>
                        <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-8">
                        <span className="font-serif text-xl text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 mr-2">USD</span>
                            <span className="font-serif text-2xl text-gray-900">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSubmit} // Trigger form submit from outside form
                        disabled={isProcessing}
                        className="w-full bg-burgundy text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-burgundy-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed hidden lg:block"
                    >
                        {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] uppercase tracking-wider">Secure Checkout</span>
                    </div>
                </div>
            </FadeIn>
        </div>

      </div>
    </div>
  );
};

// Helper for Secure Icon
const ShieldCheck = ({ size, className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export default Checkout;
