import React, { useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useInquiries } from '../../context/InquiryContext';
import { Mail, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const DashboardTab = () => {
  const { products } = useProducts();
  const { inquiries, fetchInquiries } = useInquiries();

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Product Stats
  const activeProducts = products.filter(p => p.isVisible).length;
  const inactiveProducts = products.filter(p => !p.isVisible).length;
  
  const availableCount = products.filter(p => !p.availabilityStatus || p.availabilityStatus === 'available').length;
  const specialOrderCount = products.filter(p => p.availabilityStatus === 'special_order').length;
  const outOfStockCount = products.filter(p => p.availabilityStatus === 'out_of_stock').length;

  // Inquiry Stats
  const newsletterCount = inquiries.filter(i => i.type === 'newsletter').length;
  const appointmentCount = inquiries.filter(i => i.type === 'appointment').length;
  const contactCount = inquiries.filter(i => i.type === 'contact').length;
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;

  // Activity Feeds
  const newInquiries = inquiries
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const inquiryStats = [
    { title: 'Newsletter Signups', value: newsletterCount, icon: <Mail size={20} />, color: 'bg-purple-100 text-purple-700' },
    { title: 'Appointments', value: appointmentCount, icon: <Calendar size={20} />, color: 'bg-blue-100 text-blue-700' },
    { title: 'Contact Messages', value: contactCount, icon: <MessageSquare size={20} />, color: 'bg-yellow-100 text-yellow-700' }
  ];

  const productStats = [
      { title: 'Active Products', value: activeProducts, icon: <CheckCircle size={20} />, color: 'bg-green-100 text-green-700' },
      { title: 'Inactive Products', value: inactiveProducts, icon: <XCircle size={20} />, color: 'bg-gray-100 text-gray-700' }
  ];

  const availabilityStats = [
    { label: 'Available Now', count: availableCount, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Special Order', count: specialOrderCount, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Out of Stock', count: outOfStockCount, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const renderInquiryIcon = (type) => {
    switch(type) {
      case 'appointment': return <Calendar size={16} className="text-gray-600" />;
      case 'contact': return <MessageSquare size={16} className="text-gray-600" />;
      case 'newsletter': return <Mail size={16} className="text-gray-600" />;
      default: return null;
    }
  }

  return (
    <div>
      <h2 className="text-xl font-serif mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {inquiryStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Product Inventory</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {productStats.map((stat, index) => (
                    <div key={index} className={`p-4 rounded-lg border flex justify-between items-center ${stat.bg} ${stat.color}`}>
                        <span className={`font-medium`}>{stat.title}</span>
                        <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                ))}
            </div>
            <div className="space-y-2 pt-2">
              {availabilityStats.map((stat, index) => (
                <div key={index} className={`p-3 rounded-lg border flex justify-between items-center ${stat.bg}`}>
                  <span className={`font-medium text-sm ${stat.color}`}>{stat.label}</span>
                  <span className="text-lg font-bold text-gray-900">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif">New Inquiries</h3>
            <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
              {pendingInquiries} New
            </span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {newInquiries.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">No new inquiries.</p>
            ) : (
              newInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
                    {renderInquiryIcon(inquiry.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{inquiry.email}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">
                      "{inquiry.description}"
                    </p>
                    {inquiry.type === 'appointment' && inquiry.preferred_time && (
                      <div className="flex items-center mt-2 text-xs text-burgundy">
                        <Clock size={12} className="mr-1" />
                        <span className="capitalize">{inquiry.preferred_time}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
