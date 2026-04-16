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
  LogOut,
  MessageSquare,
  Mail,
  BookOpen
} from 'lucide-react';

import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import ContentTab from '../components/admin/ContentTab';
import SettingsTab from '../components/admin/SettingsTab';
import BlogTab from '../components/admin/BlogTab';
import InquiriesTab from '../components/admin/InquiriesTab';
import GalleryTab from '../components/admin/GalleryTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={20} /> },
      ]
    },
    {
      title: 'Store',
      items: [
        { id: 'products', label: 'Products', icon: <Package size={20} /> },
      ]
    },
    {
      title: 'Content & Marketing',
      items: [
        { id: 'content', label: 'Site Content', icon: <Image size={20} /> },
        { id: 'gallery', label: 'Gallery', icon: <Image size={20} /> },
        { id: 'blog', label: 'Blog', icon: <BookOpen size={20} /> },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
      ]
    }
  ];

  const allMenuItems = menuGroups.flatMap(group => group.items);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'inquiries': return <InquiriesTab />;
      case 'products': return <ProductsTab />;
      case 'content': return <ContentTab />;
      case 'gallery': return <GalleryTab />;
      case 'blog': return <BlogTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h1 className="font-serif text-xl tracking-wide">Admin Portal</h1>
          </div>
          <nav className="p-4 space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === item.id 
                          ? 'bg-burgundy text-white' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100 mt-auto">
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
              {allMenuItems.map(item => (
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
