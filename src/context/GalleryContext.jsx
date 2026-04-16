import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

const GalleryContext = createContext();

export const useGallery = () => useContext(GalleryContext);

export function GalleryProvider({ children }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryImage = async (id, imageUrl) => {
    try {
      await deleteImage(imageUrl);
      const { error } = await supabase.from('gallery').delete().eq('id', id);

      if (error) throw error;

      setImages((prev) => prev.filter((img) => img.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery image:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateGalleryImageOrder = async (orderedImages) => {
    try {
      const updates = orderedImages.map((image, index) => ({
        id: image.id,
        position: index + 1,
        image_url: image.image_url, // Ensure these are included
        alt_text: image.alt_text,   // Ensure these are included
      }));

      const { error } = await supabase.from('gallery').upsert(updates);

      if (error) throw error;

      setImages(orderedImages);
      return { success: true };
    } catch (error) {
      console.error('Error updating gallery image order:', error.message);
      return { success: false, message: error.message };
    }
  };

  const addGalleryImage = async (imageFile, altText) => {
    try {
      const imageUrl = await uploadImage(imageFile);
      const { data: maxPositionData, error: positionError } = await supabase
        .from('gallery')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .single();

      if (positionError && positionError.code !== 'PGRST116') { // Ignore error for empty table
        throw positionError;
      }

      const newPosition = maxPositionData ? maxPositionData.position + 1 : 1;

      const { data, error } = await supabase
        .from('gallery')
        .insert([{ image_url: imageUrl, alt_text: altText, position: newPosition }])
        .select()
        .single();

      if (error) throw error;

      setImages((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error('Error adding gallery image:', error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    images,
    loading,
    addGalleryImage,
    updateGalleryImageOrder,
    deleteGalleryImage,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}
