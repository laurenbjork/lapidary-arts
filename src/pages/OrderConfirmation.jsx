import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, total, email } = location.state || { 
    orderId: '000000', 
    total: 0, 
    email: 'customer@example.com' 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20 px-4 text-center">
      <FadeIn>
        <div className="mb-6 flex justify-center text-green-600">
          <CheckCircle size={64} />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">Thank You!</h1>
        <p className="text-gray-500 text-lg mb-2">Your order has been placed successfully.</p>
        <p className="text-gray-900 font-medium mb-8">Order #{orderId}</p>
        
        <div className="bg-gray-50 p-8 rounded-sm max-w-md mx-auto mb-10 text-left">
            <p className="text-sm text-gray-600 mb-4">
                We've sent a confirmation email to <span className="font-medium text-gray-900">{email}</span>.
            </p>
            <p className="text-sm text-gray-600 mb-6">
                Your items will be shipped shortly. You can track your order status in your account.
            </p>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total Paid</span>
                <span className="font-serif text-xl text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>

        <Link 
            to="/" 
            className="inline-flex items-center bg-burgundy text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-burgundy-light transition-colors"
        >
            Continue Shopping <ArrowRight size={14} className="ml-2" />
        </Link>
      </FadeIn>
    </div>
  );
};

export default OrderConfirmation;
