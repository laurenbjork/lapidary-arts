import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

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
    facebook: 'https://facebook.com'
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
    leftTitle: 'LULU',
    leftSubtitle: 'Los Angeles',
    rightLogoImage: '' // If empty, shows text "LS"
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
        const { data, error } = await supabase.from('site_content').select('*');
        
        if (error) {
          console.warn('Supabase fetch error (using local defaults):', error.message);
          // Fallback to localStorage if Supabase fails (e.g. invalid keys)
          const savedContent = localStorage.getItem('siteContent_v2');
          if (savedContent) {
            setContent(sanitizeContent(JSON.parse(savedContent)));
          }
          return;
        }

        if (data && data.length > 0) {
          const newContent = { ...initialContent };
          data.forEach(row => {
            if (row.section_name && row.content) {
              newContent[row.section_name] = row.content;
            }
          });
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

  const uploadContentImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `content-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const BUCKET_NAME = 'product-images'; 

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading content image:', error.message);
      throw error;
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

  const addConsultation = async (consultationData) => {
    // 1. Get current list
    const currentList = content.consultations || [];
    const updatedList = [consultationData, ...currentList]; // Add to top

    // 2. Optimistic Update
    setContent((prev) => ({
      ...prev,
      consultations: updatedList
    }));

    // 3. Update Supabase
    try {
        const { error } = await supabase
        .from('site_content')
        .upsert({ 
            section_name: 'consultations', 
            content: updatedList 
        }, { onConflict: 'section_name' });

        if (error) throw error;
    } catch (err) {
        console.error('Error adding consultation:', err);
        // Rollback?
    }
  };

  const addNewsletterSignup = async (signupData) => {
    const currentList = content.newsletterSignups || [];
    const updatedList = [signupData, ...currentList];

    setContent((prev) => ({
      ...prev,
      newsletterSignups: updatedList
    }));

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          section_name: 'newsletter_signups', 
          content: updatedList 
        }, { onConflict: 'section_name' });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding newsletter signup:', err);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateCategoryImage, uploadContentImage, addConsultation, addNewsletterSignup, loading }}>
      {children}
    </ContentContext.Provider>
  );
};
