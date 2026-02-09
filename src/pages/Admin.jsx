import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Image, 
  Package, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import ContentTab from '../components/admin/ContentTab';
import OrdersTab from '../components/admin/OrdersTab';
import CustomersTab from '../components/admin/CustomersTab';
import SettingsTab from '../components/admin/SettingsTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'content', label: 'Site Content', icon: <Image size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'products': return <ProductsTab />;
      case 'orders': return <OrdersTab />;
      case 'customers': return <CustomersTab />;
      case 'content': return <ContentTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif text-xl tracking-wide">Admin Portal</h1>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === item.id 
                  ? 'bg-burgundy text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="font-serif text-lg">Admin Portal</h1>
        <div className="flex items-center space-x-2">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm max-w-[120px]"
          >
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <button onClick={handleLogout} className="text-red-600 p-1">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
