import React, { useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAppointments } from '../../context/AppointmentContext';
import { useContent } from '../../context/ContentContext';
import { Mail, ShoppingBag, Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

const DashboardTab = () => {
  const { products } = useProducts();
  const { appointments, fetchAppointments } = useAppointments();
  const { content } = useContent();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Product Stats
  const activeProducts = products.filter(p => p.isVisible).length;
  const inactiveProducts = products.filter(p => !p.isVisible).length;
  
  const availableCount = products.filter(p => !p.availabilityStatus || p.availabilityStatus === 'available').length;
  const specialOrderCount = products.filter(p => p.availabilityStatus === 'special_order').length;
  const outOfStockCount = products.filter(p => p.availabilityStatus === 'out_of_stock').length;

  // Newsletter Stats
  const newsletterCount = (content.newsletterSignups || []).length;

  // Activity Feeds
  const newAppointments = appointments
    .filter(a => a.status === 'new')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const newConsultations = (content.consultations || [])
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  const stats = [
    { 
      title: 'Newsletter Signups', 
      value: newsletterCount, 
      icon: <Mail size={20} />, 
      color: 'bg-purple-100 text-purple-700' 
    },
    { 
      title: 'Active Products', 
      value: activeProducts, 
      icon: <CheckCircle size={20} />, 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      title: 'Inactive Products', 
      value: inactiveProducts, 
      icon: <XCircle size={20} />, 
      color: 'bg-gray-100 text-gray-700' 
    },
  ];

  const availabilityStats = [
    { label: 'Available Now', count: availableCount, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Special Order', count: specialOrderCount, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Out of Stock', count: outOfStockCount, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <h2 className="text-xl font-serif mb-6">Dashboard Overview</h2>
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Product Availability Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Product Inventory Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availabilityStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg border border-gray-100 flex justify-between items-center ${stat.bg}`}>
              <span className={`font-medium ${stat.color}`}>{stat.label}</span>
              <span className="text-xl font-bold text-gray-900">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif">New Appointments</h3>
            <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
              {appointments.filter(a => a.status === 'new').length} New
            </span>
          </div>
          
          <div className="space-y-4">
            {newAppointments.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">No new appointment requests.</p>
            ) : (
              newAppointments.map((apt) => (
                <div key={apt.id} className="flex items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <Calendar size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(apt.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Request for: <span className="font-medium">{apt.product_name}</span>
                    </p>
                    <div className="flex items-center mt-2 text-xs text-burgundy">
                      <Clock size={12} className="mr-1" />
                      <span className="capitalize">{apt.preferred_time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Consultations */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif">New Consultations</h3>
            <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
              {(content.consultations || []).length} Total
            </span>
          </div>

          <div className="space-y-4">
            {newConsultations.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">No consultation requests yet.</p>
            ) : (
              newConsultations.map((consult, idx) => (
                <div key={idx} className="flex items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <MessageSquare size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{consult.name}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(consult.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {consult.description}
                    </p>
                    <a href={`mailto:${consult.email}`} className="text-xs text-burgundy mt-1 block hover:underline">
                      {consult.email}
                    </a>
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
