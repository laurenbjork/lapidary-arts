import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const DashboardTab = () => {
  const stats = [
    { title: 'Total Revenue', value: '$24,500', icon: <DollarSign size={20} />, change: '+12%', color: 'bg-green-100 text-green-700' },
    { title: 'Total Orders', value: '156', icon: <ShoppingBag size={20} />, change: '+5%', color: 'bg-blue-100 text-blue-700' },
    { title: 'New Customers', value: '48', icon: <Users size={20} />, change: '+18%', color: 'bg-purple-100 text-purple-700' },
    { title: 'Avg. Order Value', value: '$157', icon: <TrendingUp size={20} />, change: '-2%', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div>
      <h2 className="text-xl font-serif mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-md ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.title}</h3>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">New order #102{i} placed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600">+$150.00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
