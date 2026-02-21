
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

const InquiryContext = createContext();

export const useInquiries = () => useContext(InquiryContext);

export const InquiryProvider = ({ children }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const addInquiry = async (inquiryData) => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData])
        .select()
        .single();

      if (error) throw error;

      setInquiries((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding inquiry:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateInquiry = async (id, updates) => {
      try {
          const { data, error } = await supabase
              .from('inquiries')
              .update(updates)
              .eq('id', id)
              .select()
              .single();

          if (error) throw error;

          setInquiries(prev => prev.map(i => 
              i.id === id ? data : i
          ));
          return { success: true };
      } catch (error) {
          console.error('Error updating inquiry:', error.message);
          return { success: false, message: error.message };
      }
  };

  const uploadInquiryImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `inquiry-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }
  };

  return (
    <InquiryContext.Provider value={{ 
        inquiries, 
        loading, 
        fetchInquiries,
        addInquiry, 
        updateInquiry,
        uploadInquiryImage
    }}>
      {children}
    </InquiryContext.Provider>
  );
};
