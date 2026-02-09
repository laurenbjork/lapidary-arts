import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, ExternalLink } from 'lucide-react';

const SettingsTab = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
          <User className="text-[#5e2b31] mr-3" size={20} />
          <h2 className="text-xl font-serif">My Profile</h2>
        </div>
        
        <div className="max-w-xl space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Current Email</label>
              <div className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
                {currentUser?.email}
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md border border-blue-100 text-sm">
                <div className="flex items-start">
                    <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold mb-1">Account Security</h4>
                        <p>
                            Your account is securely managed via Supabase Authentication. 
                            To change your password or manage other administrators, please visit your Supabase Project Dashboard.
                        </p>
                    </div>
                </div>
            </div>
            
            <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#5e2b31] hover:underline text-sm font-medium"
            >
                Go to Supabase Dashboard <ExternalLink size={14} className="ml-1" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
