import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map DB snake_case to frontend camelCase
      const mappedProducts = (data || []).map(p => ({
        ...p,
        discountPrice: p.discount_price,
        isVisible: p.is_visible,
        isNewArrival: p.is_new_arrival,
        subcategory: p.subcategory // Ensure subcategory is mapped if it exists in DB
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadProductImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };

  const addProduct = async (product) => {
    try {
      let imageUrl = product.image;

      // Upload image if it's a File object (not a string URL)
      if (product.imageFile) {
        imageUrl = await uploadProductImage(product.imageFile);
      }

      // Remove temporary ID/file if present
      const { id, imageFile, ...productData } = product;
      
      const cleanProduct = {
        ...productData,
        price: parseFloat(productData.price),
        discount_price: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
        description: productData.description,
        image: imageUrl,
        is_visible: productData.isVisible ?? true,
        is_new_arrival: productData.isNewArrival ?? false,
      };

      // We need to map camelCase (frontend) to snake_case (DB)
      const dbProduct = {
        name: cleanProduct.name,
        category: cleanProduct.category,
        subcategory: cleanProduct.subcategory || null, // Add subcategory support
        price: cleanProduct.price,
        discount_price: cleanProduct.discount_price,
        description: cleanProduct.description,
        image: cleanProduct.image,
        is_visible: cleanProduct.is_visible,
        is_new_arrival: cleanProduct.is_new_arrival
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) throw error;

      // Map back to camelCase for state
      const newProduct = {
        ...data,
        discountPrice: data.discount_price,
        isVisible: data.is_visible,
        isNewArrival: data.is_new_arrival
      };

      setProducts((prev) => [newProduct, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      let imageUrl = updatedProduct.image;

      // Upload image if it's a File object
      if (updatedProduct.imageFile) {
        imageUrl = await uploadProductImage(updatedProduct.imageFile);
      }

      const dbUpdate = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        subcategory: updatedProduct.subcategory || null, // Add subcategory support
        price: parseFloat(updatedProduct.price),
        discount_price: updatedProduct.discountPrice ? parseFloat(updatedProduct.discountPrice) : null,
        description: updatedProduct.description,
        image: imageUrl,
        is_visible: updatedProduct.isVisible,
        is_new_arrival: updatedProduct.isNewArrival
      };

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Map back to camelCase for state
      const mappedData = {
        ...data,
        discountPrice: data.discount_price,
        isVisible: data.is_visible,
        isNewArrival: data.is_new_arrival
      };

      setProducts((prev) => prev.map((p) => (p.id === id ? mappedData : p)));
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error.message);
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error.message);
      return { success: false, message: error.message };
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter((p) => 
      p.category?.toLowerCase() === category?.toLowerCase() && p.isVisible
    );
  };

  const getNewArrivals = () => {
    return products.filter((p) => p.isNewArrival && p.isVisible);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductsByCategory, 
      getNewArrivals 
    }}>
      {children}
    </ProductContext.Provider>
  );
};
