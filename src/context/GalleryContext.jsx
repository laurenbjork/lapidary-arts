import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

const GalleryContext = createContext();

export const useGallery = () => useContext(GalleryContext);

export function GalleryProvider({ children }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryMedia();
  }, []);

  const fetchGalleryMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching gallery media:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryMedia = async (id, mediaUrl) => {
    try {
      // Only attempt to delete from storage if it's not a YouTube link
      if (!mediaUrl.startsWith('https://www.youtube.com')) {
        await deleteImage(mediaUrl);
      }
      const { error } = await supabase.from('gallery').delete().eq('id', id);

      if (error) throw error;

      setMedia((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery media:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateGalleryMediaOrder = async (orderedMedia) => {
    try {
      const updates = orderedMedia.map((item, index) => ({
        id: item.id,
        position: index + 1,
        image_url: item.image_url, 
        alt_text: item.alt_text,
        media_type: item.media_type,
      }));

      const { error } = await supabase.from('gallery').upsert(updates);

      if (error) throw error;

      setMedia(orderedMedia);
      return { success: true };
    } catch (error) {
      console.error('Error updating gallery media order:', error.message);
      return { success: false, message: error.message };
    }
  };

  const addGalleryMedia = async (mediaData, altText, mediaType) => {
    try {
      let mediaUrl;
      let finalMediaType;

      if (mediaType === 'file') {
        const fileSize = mediaData.size / 1024 / 1024; // in MB
        if (fileSize > 100) { // 100MB limit
          alert('File size exceeds the 100MB limit.');
          return { success: false, message: 'File size exceeds the 100MB limit.' };
        }
        mediaUrl = await uploadImage(mediaData);
        finalMediaType = mediaData.type.startsWith('video') ? 'video' : 'image';
      } else {
        mediaUrl = mediaData;
        finalMediaType = 'youtube';
      }

      const { data: maxPositionData, error: positionError } = await supabase
        .from('gallery')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .single();

      if (positionError && positionError.code !== 'PGRST116') {
        throw positionError;
      }

      const newPosition = maxPositionData ? maxPositionData.position + 1 : 1;

      const { data, error } = await supabase
        .from('gallery')
        .insert([{ image_url: mediaUrl, alt_text: altText, position: newPosition, media_type: finalMediaType }])
        .select()
        .single();

      if (error) throw error;

      setMedia((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error('Error adding gallery media:', error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    media,
    loading,
    addGalleryMedia,
    updateGalleryMediaOrder,
    deleteGalleryMedia,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}
