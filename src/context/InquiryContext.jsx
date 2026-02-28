
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

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

      // Instead of refetching, update state directly
      setInquiries(prev => [data, ...prev]);

    } catch (error) {
      console.error('Error adding inquiry:', error.message);
      // Propagate the error to the calling component
      throw error;
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
      } catch (error) {
          console.error('Error updating inquiry:', error.message);
          throw error;
      }
  };

  const deleteInquiry = async (id) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error.message);
      throw error;
    }
  };

  const emptyArchive = async () => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('status', 'archived');

      if (error) throw error;

      // Instead of refetching, update state directly
      setInquiries(prev => prev.filter(i => i.status !== 'archived'));

    } catch (error) {
      console.error('Error emptying archive:', error.message);
      throw error;
    }
  };

  const uploadInquiryImage = async (file) => {
    try {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading inquiry image:', error);
      // Propagate the error to be handled by the form
      throw error;
    }
  };

  return (
    <InquiryContext.Provider value={{ 
        inquiries, 
        loading, 
        fetchInquiries,
        addInquiry, 
        updateInquiry,
        deleteInquiry,
        emptyArchive,
        uploadInquiryImage,
        deleteImage
    }}>
      {children}
    </InquiryContext.Provider>
  );
};
