import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Upload, Save } from 'lucide-react';

const ContentTab = () => {
  const { content, updateContent, updateCategoryImage, uploadContentImage } = useContent();
  const [activeSection, setActiveSection] = useState('hero'); // hero, announcement, categories
  
  // Local state for forms
  const [heroForm, setHeroForm] = useState(content.hero);
  const [announcementForm, setAnnouncementForm] = useState(content.announcement);
  const [categoriesForm, setCategoriesForm] = useState(content.categories);
  const [customDesignForm, setCustomDesignForm] = useState(content.customDesign || { 
    image: '/images/custom-design-feature.jpg',
    title: 'Custom Design',
    description: 'Your vision, brought to life...',
    buttonText: 'Start Your Design',
    buttonLink: '/custom-design',
    features: [
      { title: 'Personal Consultation', description: 'Begin with an intimate discussion...' },
      { title: 'Expert Design', description: 'Our artisans create detailed renderings...' },
      { title: 'Masterful Craftsmanship', description: 'Watch as your dream piece...' }
    ]
  });

  const [watchesForm, setWatchesForm] = useState(content.watches || {
    title: "Watches",
    description: "Lapidary Art presents a curated collection of Vintage Rolex Timepieces, selected for their heritage, craftsmanship, and enduring significance.",
    linkText: "Explore Our Curated Selection",
    linkUrl: "/watches",
    items: [
      { image: '/images/necklace-2.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' },
      { image: '/images/necklace-3.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' },
      { image: '/images/necklace-4.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' }
    ]
  });

  const [brandStoryForm, setBrandStoryForm] = useState(content.brandStory || {
    image: '/images/hero-bg.jpg',
    smallText: 'www.lapidaryart.com',
    largeText: 'Future heirlooms designed and crafted in Los Angeles.'
  });

  // State to track files to upload
  const [filesToUpload, setFilesToUpload] = useState({});

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroForm({ ...heroForm, [name]: value });
  };

  const handleAnnouncementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnouncementForm({ 
      ...announcementForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoriesForm({ ...categoriesForm, [name]: value });
  };

  const handleCustomDesignChange = (e) => {
    const { name, value } = e.target;
    setCustomDesignForm({ ...customDesignForm, [name]: value });
  };

  const handleCustomDesignFeatureChange = (index, field, value) => {
    const newFeatures = [...customDesignForm.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setCustomDesignForm({ ...customDesignForm, features: newFeatures });
  };

  const handleWatchesChange = (e) => {
    const { name, value } = e.target;
    setWatchesForm({ ...watchesForm, [name]: value });
  };

  const handleWatchesItemChange = (index, field, value) => {
    const newItems = [...watchesForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setWatchesForm({ ...watchesForm, items: newItems });
  };

  const handleBrandStoryChange = (e) => {
    const { name, value } = e.target;
    setBrandStoryForm({ ...brandStoryForm, [name]: value });
  };

  const handleImageUpload = (e, section, field = 'image', index = null) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      
      // Store file for later upload
      // key format: section-field-index (or section-field if index is null)
      const key = index !== null ? `${section}-${field}-${index}` : `${section}-${field}`;
      setFilesToUpload(prev => ({ ...prev, [key]: file }));

      if (section === 'hero') {
        setHeroForm({ ...heroForm, [field]: objectUrl });
      } else if (section === 'categories') {
        setCategoriesForm({ ...categoriesForm, [field]: objectUrl });
      } else if (section === 'customDesign') {
        setCustomDesignForm({ ...customDesignForm, [field]: objectUrl });
      } else if (section === 'watches') {
         const newItems = [...watchesForm.items];
         newItems[index] = { ...newItems[index], [field]: objectUrl };
         setWatchesForm({ ...watchesForm, items: newItems });
      } else if (section === 'brandStory') {
        setBrandStoryForm({ ...brandStoryForm, [field]: objectUrl });
      }
    }
  };

  const processUploads = async (section, currentData) => {
    const updatedData = { ...currentData };
    let hasUploads = false;

    // Helper to upload and update field
    const checkAndUpload = async (fieldKey, updateFn) => {
      if (filesToUpload[fieldKey]) {
        try {
            const publicUrl = await uploadContentImage(filesToUpload[fieldKey]);
            updateFn(publicUrl);
            hasUploads = true;
            // Clear from pending uploads
            setFilesToUpload(prev => {
                const newState = { ...prev };
                delete newState[fieldKey];
                return newState;
            });
        } catch (err) {
            console.error("Upload failed for", fieldKey, err);
            alert(`Failed to upload image for ${fieldKey}`);
        }
      }
    };

    if (section === 'hero') {
        await checkAndUpload('hero-image', (url) => updatedData.image = url);
    } else if (section === 'categories') {
        // Categories uses specific keys like 'bracelets', 'rings', etc. passed as 'field'
        // We need to iterate over potential keys or just check all
        for (const key of Object.keys(filesToUpload)) {
            if (key.startsWith('categories-')) {
                const fieldName = key.replace('categories-', '');
                await checkAndUpload(key, (url) => updatedData[fieldName] = url);
            }
        }
    } else if (section === 'customDesign') {
        await checkAndUpload('customDesign-image', (url) => updatedData.image = url);
    } else if (section === 'brandStory') {
        await checkAndUpload('brandStory-image', (url) => updatedData.image = url);
    } else if (section === 'watches') {
        // Watches has items array
         for (const key of Object.keys(filesToUpload)) {
            if (key.startsWith('watches-image-')) {
                const index = parseInt(key.split('-').pop());
                await checkAndUpload(key, (url) => updatedData.items[index].image = url);
            }
        }
    }
    
    return updatedData;
  };

  const saveHero = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('hero', heroForm);
    setHeroForm(dataToSave); // Update local state with real URL
    updateContent('hero', dataToSave);
    alert('Hero section updated!');
  };

  const saveAnnouncement = (e) => {
    e.preventDefault();
    updateContent('announcement', announcementForm);
    alert('Announcement bar updated!');
  };

  const saveCategories = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('categories', categoriesForm);
    setCategoriesForm(dataToSave);
    updateContent('categories', dataToSave);
    alert('Category images updated!');
  };

  const saveCustomDesign = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('customDesign', customDesignForm);
    setCustomDesignForm(dataToSave);
    updateContent('customDesign', dataToSave);
    alert('Custom Design section updated!');
  };

  const saveWatches = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('watches', watchesForm);
    setWatchesForm(dataToSave);
    updateContent('watches', dataToSave);
    alert('Watches section updated!');
  };

  const saveBrandStory = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('brandStory', brandStoryForm);
    setBrandStoryForm(dataToSave);
    updateContent('brandStory', dataToSave);
    alert('Brand Story section updated!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Content Management</h2>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'hero' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('hero')}
        >
          Hero Section
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'announcement' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('announcement')}
        >
          Announcement Bar
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'categories' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('categories')}
        >
          Category Images
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'customDesign' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('customDesign')}
        >
          Custom Design
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'watches' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('watches')}
        >
          Watches
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'brandStory' ? 'text-burgundy border-b-2 border-burgundy' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('brandStory')}
        >
          Brand Story
        </button>
      </div>

      {activeSection === 'hero' && (
        <form onSubmit={saveHero} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Hero Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative overflow-hidden w-48 h-32 bg-gray-200 rounded-md">
                <img src={heroForm.image} alt="Hero" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                  <Upload size={16} className="mr-2" /> Change Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Headline</label>
            <input 
              type="text" 
              name="title" 
              value={heroForm.title} 
              onChange={handleHeroChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Button Text</label>
              <input 
                type="text" 
                name="buttonText" 
                value={heroForm.buttonText} 
                onChange={handleHeroChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Button Link</label>
              <input 
                type="text" 
                name="buttonLink" 
                value={heroForm.buttonLink} 
                onChange={handleHeroChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}

      {activeSection === 'announcement' && (
        <form onSubmit={saveAnnouncement} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Announcement Text</label>
            <input 
              type="text" 
              name="text" 
              value={announcementForm.text} 
              onChange={handleAnnouncementChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Link (Optional)</label>
            <input 
              type="text" 
              name="link" 
              value={announcementForm.link} 
              onChange={handleAnnouncementChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isVisible" 
                checked={announcementForm.isVisible} 
                onChange={handleAnnouncementChange} 
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show Announcement Bar</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}

      {activeSection === 'categories' && (
        <form onSubmit={saveCategories} className="space-y-6 max-w-2xl">
          {['bracelets', 'rings', 'earrings'].map((cat) => (
            <div key={cat} className="border-b border-gray-100 pb-6">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 capitalize">{cat} Image</label>
              <div className="flex items-center space-x-4">
                <div className="relative overflow-hidden w-24 h-24 bg-gray-200 rounded-md">
                  <img src={categoriesForm[cat]} alt={cat} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                    <Upload size={16} className="mr-2" /> Change Image
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'categories', cat)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}

      {activeSection === 'customDesign' && (
        <form onSubmit={saveCustomDesign} className="space-y-6 max-w-3xl">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">Main Section Content</h3>
             <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Section Title</label>
                    <input 
                    type="text" 
                    name="title" 
                    value={customDesignForm.title} 
                    onChange={handleCustomDesignChange} 
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
                    <textarea 
                    name="description" 
                    value={customDesignForm.description} 
                    onChange={handleCustomDesignChange} 
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                    rows="3"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Button Text</label>
                        <input 
                        type="text" 
                        name="buttonText" 
                        value={customDesignForm.buttonText} 
                        onChange={handleCustomDesignChange} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Button Link</label>
                        <input 
                        type="text" 
                        name="buttonLink" 
                        value={customDesignForm.buttonLink} 
                        onChange={handleCustomDesignChange} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Section Image</label>
                    <div className="flex items-center space-x-4">
                    <div className="relative overflow-hidden w-48 h-32 bg-gray-200 rounded-md">
                        <img src={customDesignForm.image} alt="Custom Design" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                        <Upload size={16} className="mr-2" /> Change Image
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'customDesign')} className="hidden" />
                        </label>
                    </div>
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">Features (3 Items)</h3>
             <div className="space-y-6">
                {customDesignForm.features?.map((feature, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Feature {index + 1} Title</label>
                                <input 
                                type="text" 
                                value={feature.title} 
                                onChange={(e) => handleCustomDesignFeatureChange(index, 'title', e.target.value)} 
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Feature {index + 1} Description</label>
                                <input 
                                type="text" 
                                value={feature.description} 
                                onChange={(e) => handleCustomDesignFeatureChange(index, 'description', e.target.value)} 
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}

      {activeSection === 'watches' && (
        <form onSubmit={saveWatches} className="space-y-6 max-w-3xl">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">Main Section Content</h3>
             <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Section Title</label>
                    <input 
                    type="text" 
                    name="title" 
                    value={watchesForm.title} 
                    onChange={handleWatchesChange} 
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
                    <textarea 
                    name="description" 
                    value={watchesForm.description} 
                    onChange={handleWatchesChange} 
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                    rows="3"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Link Text</label>
                        <input 
                        type="text" 
                        name="linkText" 
                        value={watchesForm.linkText} 
                        onChange={handleWatchesChange} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Link URL</label>
                        <input 
                        type="text" 
                        name="linkUrl" 
                        value={watchesForm.linkUrl} 
                        onChange={handleWatchesChange} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        />
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">Items (3 Items)</h3>
             <div className="space-y-6">
                {watchesForm.items?.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Item {index + 1} Image</label>
                                <div className="flex items-center space-x-4">
                                    <div className="relative overflow-hidden w-24 h-32 bg-gray-200 rounded-md">
                                        <img src={item.image} alt={`Item ${index+1}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                                            <Upload size={16} className="mr-2" /> Change Image
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'watches', 'image', index)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Title</label>
                                    <input 
                                    type="text" 
                                    value={item.title} 
                                    onChange={(e) => handleWatchesItemChange(index, 'title', e.target.value)} 
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Subtitle</label>
                                    <input 
                                    type="text" 
                                    value={item.subtitle} 
                                    onChange={(e) => handleWatchesItemChange(index, 'subtitle', e.target.value)} 
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}

      {activeSection === 'brandStory' && (
        <form onSubmit={saveBrandStory} className="space-y-6 max-w-2xl">
            <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Background Image</label>
            <div className="flex items-center space-x-4">
                <div className="relative overflow-hidden w-48 h-32 bg-gray-200 rounded-md">
                <img src={brandStoryForm.image} alt="Brand Story" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                    <Upload size={16} className="mr-2" /> Change Image
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'brandStory')} className="hidden" />
                </label>
                </div>
            </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Small Text (Top)</label>
            <input 
                type="text" 
                name="smallText" 
                value={brandStoryForm.smallText} 
                onChange={handleBrandStoryChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Main Text</label>
            <textarea 
                name="largeText" 
                value={brandStoryForm.largeText} 
                onChange={handleBrandStoryChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                rows="4"
            />
            </div>

            <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
            >
            <Save size={16} className="mr-2" /> Save Changes
            </button>
        </form>
      )}
    </div>
  );
};

export default ContentTab;
