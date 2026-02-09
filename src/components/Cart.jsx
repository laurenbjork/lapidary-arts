import React, { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          ></motion.div>

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-serif text-2xl text-gray-900 flex items-center">
                Shopping Cart
                <span className="ml-2 text-sm font-sans text-gray-500 font-normal">
                  ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-50 p-6 rounded-full">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 border-b border-gray-900 text-gray-900 pb-1 text-sm uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-lg text-gray-900 leading-tight pr-4">
                              <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)}>
                                {item.name}
                              </Link>
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                             <p className="text-sm font-medium text-gray-900">
                               ${(item.price * item.quantity).toLocaleString()}
                             </p>
                             {item.quantity > 1 && (
                               <p className="text-[10px] text-gray-500">
                                 ${item.price.toLocaleString()} each
                               </p>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif font-medium text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-burgundy text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-light transition-colors mb-3 text-center"
                >
                  Checkout
                </Link>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
