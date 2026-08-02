import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage, uploadBlogImage } from '../utils/storage';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(
          'id, created_at, title, subtitle, content, image, is_visible, slug,
          font_family, title_font_family, title_font_size, title_color,
          subtitle_font_family, subtitle_font_size, subtitle_color'
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getPostBySlug = (slug) => {
    return posts.find(p => p.slug === slug);
  };

  const addPost = async (postData) => {
    try {
        // Create a simple slug from title if not provided
        const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        const newPost = { ...postData, slug };

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([newPost])
            .select();

        if (error) throw error;
        setPosts([data[0], ...posts]);
        return { success: true };
    } catch (error) {
        console.error('Error adding blog post:', error.message);
        return { success: false, message: error.message };
    }
  };

  const updatePost = async (id, updates) => {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        
        setPosts(posts.map(p => p.id === id ? { ...p, ...updates } : p));
        return { success: true };
    } catch (error) {
        console.error('Error updating blog post:', error.message);
        return { success: false, message: error.message };
    }
  };

  const deletePost = async (id) => {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        setPosts(posts.filter(p => p.id !== id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting blog post:', error.message);
        return { success: false, message: error.message };
    }
  };



  return (
    <BlogContext.Provider value={{
      posts, 
      loading, 
      fetchPosts, 
      getPostBySlug, 
      addPost, 
      updatePost, 
      deletePost,
      uploadBlogImage,
      deleteImage
    }}>
      {children}
    </BlogContext.Provider>
  );
};
