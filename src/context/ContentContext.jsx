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
    bracelets: '/images/category-necklaces.jpg',
    rings: '/images/category-rings.jpg',
    earrings: '/images/category-earrings.jpg'
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
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('*');
        
        if (error) {
          console.warn('Supabase fetch error (using local defaults):', error.message);
          // Fallback to localStorage if Supabase fails (e.g. invalid keys)
          const savedContent = localStorage.getItem('siteContent');
          if (savedContent) {
            setContent(JSON.parse(savedContent));
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
          setContent(newContent);
        } else {
            // If DB is empty, try localStorage as secondary fallback
            const savedContent = localStorage.getItem('siteContent');
            if (savedContent) {
                setContent(JSON.parse(savedContent));
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
    localStorage.setItem('siteContent', JSON.stringify(content));
  }, [content]);

  const updateContent = async (section, data) => {
    const updatedSection = { ...content[section], ...data };
    
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

  return (
    <ContentContext.Provider value={{ content, updateContent, updateCategoryImage, uploadContentImage, loading }}>
      {children}
    </ContentContext.Provider>
  );
};
