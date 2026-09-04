import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Mail, Calendar, Phone, Download, Upload, Save, Trash2 } from 'lucide-react';

const NewsletterTab = () => {
  const { content, updateContent, uploadContentImage, deleteNewsletterSignup } = useContent();
  const signups = content.newsletterSignups || [];
  const [activeSubTab, setActiveSubTab] = useState('signups'); // 'signups' or 'settings'

  // Settings State
  const [popupForm, setPopupForm] = useState({
    leftImage: '/images/necklace-2.jpg',
    leftTitle: 'Lapidary Arts',
    leftSubtitle: 'Bespoke Jewelry',
    rightLogoImage: '',
    popupTitle: "Don't miss a thing",
    popupDescription: "Sign up for new arrivals, exclusive offers, events and more.",
    ...(content.newsletterPopup || {})
  });
  const [filesToUpload, setFilesToUpload] = useState({});

  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setPopupForm({ ...popupForm, [name]: value });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFilesToUpload(prev => ({ ...prev, [field]: file }));
      setPopupForm(prev => ({ ...prev, [field]: objectUrl }));
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    let updatedPopup = { ...popupForm };

    // Process uploads
    try {
        if (filesToUpload.leftImage) {
            const url = await uploadContentImage(filesToUpload.leftImage);
            updatedPopup.leftImage = url;
        }
        if (filesToUpload.rightLogoImage) {
            const url = await uploadContentImage(filesToUpload.rightLogoImage);
            updatedPopup.rightLogoImage = url;
        }

        updateContent('newsletterPopup', updatedPopup);
        setPopupForm(updatedPopup);
        setFilesToUpload({}); // Clear pending
        alert('Popup settings updated!');
    } catch (err) {
        console.error("Failed to save popup settings:", err);
        alert("Failed to save settings. Please try again.");
    }
  };

  const handleDelete = async (email) => {
      if (window.confirm(`Are you sure you want to delete ${email}?`)) {
          await deleteNewsletterSignup(email);
      }
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Email', 'Phone', 'Country', 'Signed Up At'];
    const csvContent = [
      headers.join(','),
      ...signups.map(s => [s.email, s.phone, s.country, s.signedUpAt].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif">Newsletter Management</h2>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => setActiveSubTab('signups')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'signups' ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
                Subscribers
            </button>
            <button 
                onClick={() => setActiveSubTab('settings')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeSubTab === 'settings' ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
                Popup Settings
            </button>
        </div>
      </div>

      {activeSubTab === 'settings' ? (
        <form onSubmit={saveSettings} className="max-w-4xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side Config */}
                <div className="space-y-6">
                    <h3 className="font-medium text-lg border-b pb-2">Popup Left Side (Image)</h3>
                    
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Left Image <span className="text-gray-400 normal-case ml-2">(Rec: 400x500px Portrait)</span>
                        </label>
                        <div className="flex items-start space-x-4">
                            <div className="relative w-32 h-40 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img src={popupForm.leftImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                                    <Upload size={14} className="mr-2" /> Upload Image
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'leftImage')} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-400 mt-2">The main visual for the popup.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Overlay Title</label>
                        <input 
                            type="text" 
                            name="leftTitle"
                            value={popupForm.leftTitle} 
                            onChange={handlePopupChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. Lapidary Arts"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Overlay Subtitle</label>
                        <input 
                            type="text" 
                            name="leftSubtitle"
                            value={popupForm.leftSubtitle} 
                            onChange={handlePopupChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. Bespoke Jewelry"
                        />
                    </div>
                </div>

                {/* Right Side Config */}
                <div className="space-y-6">
                    <h3 className="font-medium text-lg border-b pb-2">Popup Right Side (Form)</h3>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Form Logo <span className="text-gray-400 normal-case ml-2">(Rec: 150x80px / Transparent PNG)</span>
                        </label>
                        <div className="flex items-start space-x-4">
                            <div className="relative w-32 h-16 bg-gray-50 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                {popupForm.rightLogoImage ? (
                                    <img src={popupForm.rightLogoImage} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                                ) : (
                                    <span className="text-gray-300 text-xs italic">Default Text</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                                    <Upload size={14} className="mr-2" /> Upload Logo
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'rightLogoImage')} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-400 mt-2">Replaces the "LS" text at the top of the form.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Main Title</label>
                        <input 
                            type="text" 
                            name="popupTitle"
                            value={popupForm.popupTitle} 
                            onChange={handlePopupChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. Don't miss a thing"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description Text</label>
                        <textarea 
                            name="popupDescription"
                            value={popupForm.popupDescription} 
                            onChange={handlePopupChange}
                            rows={3}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. Sign up for new arrivals..."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t">
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
                >
                    <Save size={16} className="mr-2" /> Save Settings
                </button>
            </div>
        </form>
      ) : (
        <>
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Download size={16} className="mr-2" />
                    Export CSV
                </button>
            </div>

            {signups.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No subscribers yet</h3>
                <p className="text-gray-500">New signups from the popup will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {signups.map((signup) => (
                        <tr key={signup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {new Date(signup.signedUpAt).toLocaleDateString()}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <Mail size={14} className="mr-2 text-gray-400" />
                                <a href={`mailto:${signup.email}`} className="text-sm font-medium text-gray-900 hover:text-burgundy">
                                    {signup.email}
                                </a>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signup.phone ? (
                                <div className="flex items-center">
                                    <Phone size={14} className="mr-2 text-gray-400" />
                                    {signup.phone}
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signup.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => handleDelete(signup.email)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default NewsletterTab;
