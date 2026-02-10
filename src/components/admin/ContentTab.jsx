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

  const [customDesignPageForm, setCustomDesignPageForm] = useState(content.customDesignPage || {
    image: '/images/custom-design-feature.jpg',
    title: 'Custom Design',
    description: 'Our custom design process allows you to work one-on-one with our designers to create the jewelry of your dreams.',
    buttonText: 'Book a Consultation'
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

  const [aboutForm, setAboutForm] = useState(content.about || {
    image: '/images/home-hero-model.jpg',
    title: 'About Lapidary Art',
    subtitle: 'A legacy of craftsmanship and passion for fine jewelry.',
    paragraph1: "Lapidary Art Jewelry was founded with a simple mission...",
    paragraph2: "We believe that every piece of jewelry tells a story..."
  });

  const [socialsForm, setSocialsForm] = useState(content.socials || {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  });

  const [pressCarouselForm, setPressCarouselForm] = useState(content.pressCarousel || ["The Knot"]);

  const [instagramFeedForm, setInstagramFeedForm] = useState(() => {
    const feed = content.instagramFeed;
    if (Array.isArray(feed)) return feed;
    if (feed && typeof feed === 'object') return Object.values(feed);
    return [
      { image: '/images/earring-1.jpg', link: '#' },
      { image: '/images/earring-2.jpg', link: '#' },
      { image: '/images/earring-3.jpg', link: '#' },
      { image: '/images/earring-4.jpg', link: '#' },
      { image: '/images/earring-5.jpg', link: '#' }
    ];
  });

  const [footerForm, setFooterForm] = useState(content.footer || {
    logo: '/images/Home.png'
  });

  const [newPressBrand, setNewPressBrand] = useState('');

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

  const handleCategoryChange = (cardKey, field, value) => {
    setCategoriesForm(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        [field]: value
      }
    }));
  };

  const handleCustomDesignChange = (e) => {
    const { name, value } = e.target;
    setCustomDesignForm({ ...customDesignForm, [name]: value });
  };

  const handleCustomDesignPageChange = (e) => {
    const { name, value } = e.target;
    setCustomDesignPageForm({ ...customDesignPageForm, [name]: value });
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

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutForm({ ...aboutForm, [name]: value });
  };

  const handleSocialsChange = (e) => {
    const { name, value } = e.target;
    setSocialsForm({ ...socialsForm, [name]: value });
  };

  const handleAddPressBrand = (brand) => {
    if (brand && !pressCarouselForm.includes(brand)) {
        setPressCarouselForm([...pressCarouselForm, brand]);
    }
  };

  const handleRemovePressBrand = (brandToRemove) => {
    setPressCarouselForm(pressCarouselForm.filter(brand => brand !== brandToRemove));
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
        setCategoriesForm(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            [field]: objectUrl
          }
        }));
      } else if (section === 'customDesign') {
        setCustomDesignForm({ ...customDesignForm, [field]: objectUrl });
      } else if (section === 'customDesignPage') {
        setCustomDesignPageForm({ ...customDesignPageForm, [field]: objectUrl });
      } else if (section === 'watches') {
         const newItems = [...watchesForm.items];
         newItems[index] = { ...newItems[index], [field]: objectUrl };
         setWatchesForm({ ...watchesForm, items: newItems });
      } else if (section === 'brandStory') {
        setBrandStoryForm({ ...brandStoryForm, [field]: objectUrl });
      } else if (section === 'about') {
        setAboutForm({ ...aboutForm, [field]: objectUrl });
      } else if (section === 'footer') {
        setFooterForm({ ...footerForm, [field]: objectUrl });
      } else if (section === 'instagramFeed') {
        const newItems = [...instagramFeedForm];
        if (!newItems[index]) newItems[index] = {};
        newItems[index].image = objectUrl;
        setInstagramFeedForm(newItems);
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
            alert(`Failed to upload image for ${fieldKey}: ${err.message}`);
        }
      }
    };

    if (section === 'hero') {
        await checkAndUpload('hero-image', (url) => updatedData.image = url);
    } else if (section === 'categories') {
        for (const key of Object.keys(filesToUpload)) {
            if (key.startsWith('categories-image-')) {
                const cardKey = key.split('-').pop();
                await checkAndUpload(key, (url) => updatedData[cardKey].image = url);
            }
        }
    } else if (section === 'customDesign') {
        await checkAndUpload('customDesign-image', (url) => updatedData.image = url);
    } else if (section === 'customDesignPage') {
        await checkAndUpload('customDesignPage-image', (url) => updatedData.image = url);
    } else if (section === 'brandStory') {
        await checkAndUpload('brandStory-image', (url) => updatedData.image = url);
    } else if (section === 'about') {
        await checkAndUpload('about-image', (url) => updatedData.image = url);
    } else if (section === 'footer') {
        await checkAndUpload('footer-logo', (url) => updatedData.logo = url);
    } else if (section === 'instagramFeed') {
        for (const key of Object.keys(filesToUpload)) {
            if (key.startsWith('instagramFeed-image-')) {
                const index = parseInt(key.split('-').pop());
                await checkAndUpload(key, (url) => updatedData[index].image = url);
            }
        }
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
    alert('Home Custom Design section updated!');
  };

  const saveCustomDesignPage = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('customDesignPage', customDesignPageForm);
    setCustomDesignPageForm(dataToSave);
    updateContent('customDesignPage', dataToSave);
    alert('Custom Design Page updated!');
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

  const saveAbout = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('about', aboutForm);
    setAboutForm(dataToSave);
    updateContent('about', dataToSave);
    alert('About section updated!');
  };

  const saveSocials = (e) => {
    e.preventDefault();
    updateContent('socials', socialsForm);
    alert('Social media links updated!');
  };

  const savePressCarousel = (e) => {
    e.preventDefault();
    updateContent('pressCarousel', pressCarouselForm);
    alert('Press Carousel updated!');
  };

  const saveFooter = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('footer', footerForm);
    setFooterForm(dataToSave);
    updateContent('footer', dataToSave);
    alert('Footer logo updated!');
  };

  const saveInstagramFeed = async (e) => {
    e.preventDefault();
    const dataToSave = await processUploads('instagramFeed', instagramFeedForm);
    setInstagramFeedForm(dataToSave);
    updateContent('instagramFeed', dataToSave);
    alert('Instagram Feed updated!');
  };

  const handleAddInstagramImage = () => {
    setInstagramFeedForm([...instagramFeedForm, { image: '', link: '#' }]);
  };

  const handleRemoveInstagramImage = (index) => {
    const newItems = instagramFeedForm.filter((_, i) => i !== index);
    setInstagramFeedForm(newItems);
  };

  const handleInstagramItemChange = (index, field, value) => {
    const newItems = [...instagramFeedForm];
    newItems[index] = { ...newItems[index], [field]: value };
    setInstagramFeedForm(newItems);
  };

  const menuGroups = [
    {
      title: 'Home Page',
      items: [
        { id: 'hero', label: 'Hero Section' },
        { id: 'announcement', label: 'Announcement Bar' },
        { id: 'categories', label: 'Category Images' },
        { id: 'customDesign', label: 'Home - Custom Design' },
        { id: 'brandStory', label: 'Brand Story' },
        { id: 'instagramFeed', label: 'Instagram Feed' },
      ]
    },
    {
      title: 'Pages',
      items: [
        { id: 'about', label: 'About Page' },
        { id: 'customDesignPage', label: 'Custom Design Page' },
      ]
    },
    {
      title: 'Global',
      items: [
        { id: 'socials', label: 'Social Media' },
        { id: 'footer', label: 'Footer Logo' },
        { id: 'pressCarousel', label: 'Press Carousel' },
      ]
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-burgundy text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-xl font-serif text-gray-900">
            {menuGroups.flatMap(g => g.items).find(i => i.id === activeSection)?.label}
          </h2>
        </div>

      {activeSection === 'instagramFeed' && (
        <form onSubmit={saveInstagramFeed} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            {Array.isArray(instagramFeedForm) && instagramFeedForm.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md relative">
                <button 
                  type="button"
                  onClick={() => handleRemoveInstagramImage(index)}
                  className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative overflow-hidden w-24 h-24 bg-gray-200 rounded-md">
                        {item.image ? (
                          <img src={item.image} alt={`Feed ${index}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                          <Upload size={14} className="mr-2" /> Upload
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'instagramFeed', 'image', index)} className="hidden" />
                        </label>
                        <p className="text-[10px] text-gray-400 mt-1">Recommended: 800 x 800 px (Square)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Post Link</label>
                    <input 
                      type="text" 
                      value={item.link || '#'} 
                      onChange={(e) => handleInstagramItemChange(index, 'link', e.target.value)} 
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                      placeholder="https://instagram.com/p/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={handleAddInstagramImage}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
          >
            + Add Image
          </button>

          <button 
            type="submit" 
            className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </form>
      )}



      {activeSection === 'footer' && (
        <form onSubmit={saveFooter} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Footer Logo</label>
            <div className="flex items-center space-x-4">
              <div className="relative overflow-hidden w-48 h-32 bg-gray-800 rounded-md flex items-center justify-center">
                <img src={footerForm.logo} alt="Footer Logo" className="h-16 mx-auto object-contain" />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                  <Upload size={16} className="mr-2" /> Change Logo
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'footer', 'logo')} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Recommended: Transparent PNG or SVG, White/Light Color</p>
              </div>
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

      {activeSection === 'about' && (
        <form onSubmit={saveAbout} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">About Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative overflow-hidden w-32 h-40 bg-gray-200 rounded-md">
                <img src={aboutForm.image} alt="About" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                  <Upload size={16} className="mr-2" /> Change Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'about')} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Recommended: 800 x 1000 px (Portrait)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Title</label>
            <input 
              type="text" 
              name="title" 
              value={aboutForm.title} 
              onChange={handleAboutChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Subtitle</label>
            <input 
              type="text" 
              name="subtitle" 
              value={aboutForm.subtitle} 
              onChange={handleAboutChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Paragraph 1</label>
            <textarea 
              name="paragraph1" 
              value={aboutForm.paragraph1} 
              onChange={handleAboutChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Paragraph 2</label>
            <textarea 
              name="paragraph2" 
              value={aboutForm.paragraph2} 
              onChange={handleAboutChange} 
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

      {activeSection === 'customDesignPage' && (
        <form onSubmit={saveCustomDesignPage} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Page Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative overflow-hidden w-48 h-32 bg-gray-200 rounded-md">
                <img src={customDesignPageForm.image} alt="Custom Design Page" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                  <Upload size={16} className="mr-2" /> Change Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'customDesignPage')} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 x 800 px</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Page Title</label>
            <input 
              type="text" 
              name="title" 
              value={customDesignPageForm.title} 
              onChange={handleCustomDesignPageChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
            <textarea 
              name="description" 
              value={customDesignPageForm.description} 
              onChange={handleCustomDesignPageChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Button Text</label>
            <input 
              type="text" 
              name="buttonText" 
              value={customDesignPageForm.buttonText} 
              onChange={handleCustomDesignPageChange} 
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
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

      {activeSection === 'socials' && (
        <form onSubmit={saveSocials} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Instagram URL</label>
            <div className="relative">
                <input 
                type="text" 
                name="instagram" 
                value={socialsForm.instagram} 
                onChange={handleSocialsChange} 
                className="w-full border border-gray-300 px-3 py-2 pl-10 rounded-md focus:outline-none focus:border-black"
                placeholder="https://instagram.com/yourprofile"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                    {/* Assuming you might want an icon here, but text is fine */}
                    <span className="text-xs">IG</span>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Facebook URL</label>
            <div className="relative">
                <input 
                type="text" 
                name="facebook" 
                value={socialsForm.facebook} 
                onChange={handleSocialsChange} 
                className="w-full border border-gray-300 px-3 py-2 pl-10 rounded-md focus:outline-none focus:border-black"
                placeholder="https://facebook.com/yourprofile"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                     <span className="text-xs">FB</span>
                </div>
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

      {activeSection === 'pressCarousel' && (
        <div className="space-y-6 max-w-2xl">
            <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Current Brands</label>
                <div className="space-y-2">
                    {pressCarouselForm.map((brand, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                            <span className="font-serif italic">{brand}</span>
                            <button 
                                type="button" 
                                onClick={() => handleRemovePressBrand(brand)}
                                className="text-red-500 hover:text-red-700 text-xs uppercase tracking-wider"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {pressCarouselForm.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No brands added yet.</p>
                    )}
                </div>
            </div>

            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Add New Brand</label>
                    <input 
                        type="text" 
                        value={newPressBrand}
                        onChange={(e) => setNewPressBrand(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        placeholder="e.g. The Knot"
                    />
                </div>
                <button 
                    type="button"
                    onClick={() => {
                        handleAddPressBrand(newPressBrand);
                        setNewPressBrand('');
                    }}
                    disabled={!newPressBrand.trim()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md text-xs uppercase tracking-widest hover:bg-black disabled:bg-gray-300"
                >
                    Add
                </button>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <button 
                    onClick={savePressCarousel}
                    className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light flex items-center"
                >
                    <Save size={16} className="mr-2" /> Save Changes
                </button>
            </div>
        </div>
      )}

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
                <p className="text-[10px] text-gray-400 mt-1">Recommended: 1920 x 1080 px (Landscape)</p>
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
          {['card1', 'card2', 'card3'].map((cardKey, index) => (
            <div key={cardKey} className="border-b border-gray-100 pb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Category Card {index + 1}</h3>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Image</label>
                    <div className="flex items-center space-x-4">
                        <div className="relative overflow-hidden w-24 h-32 bg-gray-200 rounded-md">
                        <img src={categoriesForm[cardKey]?.image} alt={cardKey} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                            <Upload size={16} className="mr-2" /> Change Image
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'categories', 'image', cardKey)} className="hidden" />
                        </label>
                        <p className="text-[10px] text-gray-400 mt-1">Recommended: 600 x 800 px</p>
                        </div>
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Name</label>
                    <input 
                        type="text" 
                        value={categoriesForm[cardKey]?.name || ''} 
                        onChange={(e) => handleCategoryChange(cardKey, 'name', e.target.value)} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                    />
                </div>

                {/* Link Input */}
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Link Path</label>
                    <input 
                        type="text" 
                        value={categoriesForm[cardKey]?.link || ''} 
                        onChange={(e) => handleCategoryChange(cardKey, 'link', e.target.value)} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                        placeholder="/shop/category-name"
                    />
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
                        <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 x 800 px</p>
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
                <p className="text-[10px] text-gray-400 mt-1">Recommended: 1920 x 800 px (Landscape)</p>
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
    </div>
  );
};

export default ContentTab;
