import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const initialContent = {
  hero: {
    image: '/images/home-hero-model.jpg',
    title: "Valentine's Day Gift Guide",
    subtitle: "",
    buttonText: "Shop Now",
    buttonLink: "/gifts"
  },
  gifting: [
    { name: 'Daughters', link: '/gifts/daughters', image: '' },
    { name: 'Lovers', link: '/gifts/lovers', image: '' },
    { name: 'Friend', link: '/gifts/friend', image: '' },
    { name: 'Mamas', link: '/gifts/mamas', image: '' },
    { name: 'The Minimalist', link: '/gifts/the-minimalist', image: '' },
    { name: 'The Maximalist', link: '/gifts/the-maximalist', image: '' },
    { name: 'Bridal Jewelry', link: '/gifts/bridal-jewelry', image: '' },
    { name: 'Best Sellers', link: '/gifts/best-sellers', image: '' }
  ],
  announcement: {
    text: "Complimentary shipping with code DAYGLOW at checkout",
    link: "/shop",
    isVisible: true
  },
  categories: {
    card1: {
      name: 'Bracelets',
      image: '/images/category-necklaces.jpg',
      link: '/shop/bracelets'
    },
    card2: {
      name: 'Rings',
      image: '/images/category-rings.jpg',
      link: '/shop/rings'
    },
    card3: {
      name: 'Earrings',
      image: '/images/category-earrings.jpg',
      link: '/shop/earrings'
    }
  },
  customDesign: {
    image: '/images/custom-design-feature.jpg',
    title: 'Custom Design',
    description: 'Your vision, brought to life with unparalleled artistry. Our custom design process ensures every detail reflects your unique story and style.',
    buttonText: 'Start Your Design',
    buttonLink: '/custom-design',
    features: [
      { 
        title: 'Personal Consultation', 
        description: 'Begin with an intimate discussion of your vision and preferences' 
      },
      { 
        title: 'Expert Design', 
        description: 'Our artisans create detailed renderings for your approval' 
      },
      { 
        title: 'Masterful Craftsmanship', 
        description: 'Watch as your dream piece is meticulously handcrafted' 
      }
    ]
  },
  customDesignPage: {
    image: '/images/custom-design-feature.jpg',
    title: 'Custom Design',
    description: 'Our custom design process allows you to work one-on-one with our designers to create the jewelry of your dreams.',
    buttonText: 'Book a Consultation',
    steps: [
      {
        title: 'Personal Consultation',
        description: 'Begin with an intimate discussion of your vision and preferences'
      },
      {
        title: 'Expert Design',
        description: 'Our artisans create detailed renderings for your approval'
      },
      {
        title: 'Masterful Craftsmanship',
        description: 'Watch as your dream piece is meticulously handcrafted'
      }
    ]
  },
  watches: {
    title: "Watches",
    description: "Lapidary Art presents a curated collection of Vintage Rolex Timepieces, selected for their heritage, craftsmanship, and enduring significance.",
    linkText: "Explore Our Curated Selection",
    linkUrl: "/watches",
    items: [
      { image: '/images/necklace-2.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' },
      { image: '/images/necklace-3.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' },
      { image: '/images/necklace-4.jpg', title: 'Lady Datejust', subtitle: 'Rolex Certified Pre-Owned' }
    ]
  },
  brandStory: {
    image: '/images/hero-bg.jpg',
    smallText: 'www.lapidaryart.com',
    largeText: 'Future heirlooms designed and crafted in Los Angeles.'
  },
  about: {
    image: '/images/home-hero-model.jpg',
    title: 'About Lapidary Art',
    subtitle: 'A legacy of craftsmanship and passion for fine jewelry.',
    paragraph1: "Lapidary Art Jewelry was founded with a simple mission: to create breathtaking jewelry that celebrates life's most precious moments. Our team of master jewelers and designers are dedicated to the highest standards of quality and artistry.",
    paragraph2: "We believe that every piece of jewelry tells a story. Whether it's a custom engagement ring or a timeless necklace, we pour our heart and soul into every creation."
  },
  footer: {
    logo: '/images/Home.png'
  },
  socials: {
    instagram: 'https://www.instagram.com/lapidaryartsjewelry/',
    facebook: 'https://www.facebook.com/LapidaryArtsCJ/'
  },
  pressCarousel: [
    "The Knot"
  ],
  instagramFeed: [
    { image: '/images/earring-1.jpg', link: '#' },
    { image: '/images/earring-2.jpg', link: '#' },
    { image: '/images/earring-3.jpg', link: '#' },
    { image: '/images/earring-4.jpg', link: '#' },
    { image: '/images/earring-5.jpg', link: '#' },
    { image: '/images/earring-6.jpg', link: '#' },
    { image: '/images/earring-7.jpg', link: '#' },
    { image: '/images/earring-8.jpg', link: '#' },
    { image: '/images/earring-9.jpg', link: '#' },
    { image: '/images/earring-10.jpg', link: '#' }
  ],
  consultations: [],
  newsletterSignups: [],
  newsletterPopup: {
    leftImage: '/images/necklace-2.jpg',
    leftTitle: 'Lapidary Arts',
    leftSubtitle: 'Jewelry',
    rightLogoImage: '', // If empty, shows text "LS"
    popupTitle: "Don't miss a thing",
    popupDescription: "Sign up for new arrivals, exclusive offers, events and more."
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);

  // Helper to sanitize content and remove stale blob URLs
  const sanitizeContent = (data) => {
    if (!data) return data;
    
    // Deep clone to avoid mutating original
    const cleanData = JSON.parse(JSON.stringify(data));
    
    const cleanValue = (val) => {
      if (typeof val === 'string' && val.startsWith('blob:')) {
        return ''; // Reset invalid blob URLs
      }
      return val;
    };

    // Helper to fix corrupted arrays (e.g. if they were saved as objects)
    const fixArray = (val) => {
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed;
                if (parsed && typeof parsed === 'object') return Object.values(parsed);
                return [];
            } catch (e) {
                return [];
            }
        }
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        return Object.values(val);
      }
      return Array.isArray(val) ? val : [];
    };

    // Fix specific known array sections
    if (cleanData.instagramFeed) cleanData.instagramFeed = fixArray(cleanData.instagramFeed);
    if (cleanData.pressCarousel) cleanData.pressCarousel = fixArray(cleanData.pressCarousel);
    if (cleanData.gifting) cleanData.gifting = fixArray(cleanData.gifting);
    if (cleanData.customDesign && cleanData.customDesign.features) cleanData.customDesign.features = fixArray(cleanData.customDesign.features);
    if (cleanData.customDesignPage && cleanData.customDesignPage.steps) cleanData.customDesignPage.steps = fixArray(cleanData.customDesignPage.steps);
    if (cleanData.watches && cleanData.watches.items) cleanData.watches.items = fixArray(cleanData.watches.items);

    const traverse = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key]);
        } else {
          obj[key] = cleanValue(obj[key]);
        }
      }
    };

    traverse(cleanData);
    return cleanData;
  };

  // Fetch content from Supabase on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 1. Fetch Site Content
        const { data, error } = await supabase.from('site_content').select('*');
        
        // 2. Fetch Consultations (separate table)
        const { data: consultationsData, error: consultError } = await supabase
            .from('consultations')
            .select('*')
            .order('created_at', { ascending: false });

        // 3. Fetch Newsletter Signups (separate table)
        const { data: newsletterData, error: newsletterError } = await supabase
            .from('newsletter_signups')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error (using local defaults):', error.message);
          // Fallback to localStorage if Supabase fails
          const savedContent = localStorage.getItem('siteContent_v2');
          if (savedContent) {
            setContent(sanitizeContent(JSON.parse(savedContent)));
          }
          return;
        }

        if (data && data.length > 0) {
          const newContent = { ...initialContent };
          data.forEach(row => {
            if (row.section_name === 'gifting' && Array.isArray(row.content)) {
                const dbItems = row.content;
                const defaultItems = initialContent.gifting;
                const defaultNames = new Set(defaultItems.map(item => item.name));
        
                const mergedItems = defaultItems.map(defaultItem => {
                    const dbItem = dbItems.find(item => item.name === defaultItem.name);
                    return { ...defaultItem, ...(dbItem || {}), isEssential: true };
                });
        
                dbItems.forEach(dbItem => {
                    if (!defaultNames.has(dbItem.name)) {
                        mergedItems.push({ ...dbItem, isEssential: false });
                    }
                });
        
                newContent.gifting = mergedItems;
        
            } else if (row.section_name && row.content) {
              newContent[row.section_name] = row.content;
            }
          });
          
          // Merge consultations if available
          if (consultationsData) {
            // Map snake_case DB columns to camelCase frontend props if needed
            // But currently frontend uses: name, email, phone, description, imageUrl, submittedAt/created_at
            newContent.consultations = consultationsData.map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                description: c.description,
                preferredTime: c.preferred_time,
                imageUrl: c.image_url,
                submittedAt: c.created_at,
                status: c.status,
                adminNotes: c.admin_notes
            }));
          }

          // Merge newsletter signups if available
          if (newsletterData) {
            newContent.newsletterSignups = newsletterData.map(item => ({
              ...item,
              signedUpAt: item.created_at
            }));
          }

          // Also sanitize DB content just in case bad data got in
          setContent(sanitizeContent(newContent));
        } else {
            // If DB is empty, try localStorage as secondary fallback
            const savedContent = localStorage.getItem('siteContent_v2');
            if (savedContent) {
                setContent(sanitizeContent(JSON.parse(savedContent)));
            }
        }
      } catch (err) {
        console.error('Unexpected error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Save to localStorage whenever content changes (as backup/cache)
  useEffect(() => {
    localStorage.setItem('siteContent_v2', JSON.stringify(content));
  }, [content]);



  const updateInstagramFeed = async (newFeed) => {
    // 1. Optimistic Update
    setContent(prev => ({
      ...prev,
      instagramFeed: newFeed
    }));

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section_name: 'instagramFeed', 
          content: newFeed
        }, { onConflict: 'section_name' });

      if (error) throw error;
    } catch (err) {
      console.error(`Error updating Instagram feed:`, err);
    }
  };

  const updateContent = async (section, data) => {
    // Check if we're updating an array directly (like instagramFeed)
    const isArraySection = Array.isArray(data) || (Array.isArray(content[section]) && Array.isArray(data));
    
    const updatedSection = isArraySection ? data : { ...content[section], ...data };
    
    // 1. Optimistic Update
    setContent((prev) => ({
      ...prev,
      [section]: updatedSection
    }));

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section_name: section, 
          content: updatedSection 
        }, { onConflict: 'section_name' });

      if (error) throw error;
    } catch (err) {
      console.error(`Error updating section ${section}:`, err);
      // Optionally revert state here if strict consistency is needed
    }
  };

  const updateCategoryImage = async (category, imageUrl) => {
    const updatedCategories = {
        ...content.categories,
        [category]: imageUrl
    };

    // 1. Optimistic Update
    setContent((prev) => ({
      ...prev,
      categories: updatedCategories
    }));

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section_name: 'categories', 
          content: updatedCategories 
        }, { onConflict: 'section_name' });

      if (error) throw error;
    } catch (err) {
      console.error(`Error updating category ${category}:`, err);
    }
  };



  const addNewsletterSignup = async (signupData) => {
    // 1. Optimistic Update
    const currentList = content.newsletterSignups || [];
    // Ensure we have a consistent structure for optimistic UI
    const optimisticItem = {
        ...signupData,
        signedUpAt: new Date().toISOString()
    };
    const updatedList = [optimisticItem, ...currentList];

    setContent((prev) => ({
      ...prev,
      newsletterSignups: updatedList
    }));

    // 2. Update Supabase (New Table)
    try {
      const { error } = await supabase
        .from('newsletter_signups')
        .insert([{ 
          email: signupData.email,
          phone: signupData.phone || null,
          country: signupData.country || 'US'
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error adding newsletter signup:', err);
      // alert('Failed to save signup');
    }
  };

  const deleteNewsletterSignup = async (email) => {
      // 1. Optimistic Update
      const currentList = content.newsletterSignups || [];
      const updatedList = currentList.filter(item => item.email !== email);

      setContent((prev) => ({
          ...prev,
          newsletterSignups: updatedList
      }));

      // 2. Update Supabase
      try {
          const { error } = await supabase
              .from('newsletter_signups')
              .delete()
              .eq('email', email);

          if (error) throw error;
      } catch (err) {
          console.error('Error deleting newsletter signup:', err);
          // Revert on error if needed
      }
  };

  const deleteConsultation = async (id) => {
    // 1. Optimistic Update
    const currentList = content.consultations || [];
    const updatedList = currentList.filter(item => item.id !== id);

    setContent((prev) => ({
        ...prev,
        consultations: updatedList
    }));

    // 2. Update Supabase
    try {
        const { error } = await supabase
            .from('consultations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (err) {
        console.error('Error deleting consultation:', err);
    }
  };

  const updateConsultationNote = async (id, note) => {
      // 1. Optimistic Update
      const currentList = content.consultations || [];
      const updatedList = currentList.map(item => 
          item.id === id ? { ...item, adminNotes: note } : item
      );

      setContent((prev) => ({
          ...prev,
          consultations: updatedList
      }));

      // 2. Update Supabase
      try {
          const { error } = await supabase
              .from('consultations')
              .update({ admin_notes: note })
              .eq('id', id);

          if (error) throw error;
      } catch (err) {
          console.error('Error updating consultation note:', err);
      }
  };

  return (
    <ContentContext.Provider value={{ 
        content, 
        updateContent, 
        updateInstagramFeed,
        updateCategoryImage, 
        uploadImage, 
        deleteImage,
        deleteConsultation,
        updateConsultationNote,
        addNewsletterSignup, 
        deleteNewsletterSignup,
        loading 
    }}>
      {children}
    </ContentContext.Provider>
  );
};
