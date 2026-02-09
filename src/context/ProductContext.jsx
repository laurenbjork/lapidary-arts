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
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      // Remove temporary ID if present and ensure numbers are numbers
      const { id, ...productData } = product;
      const cleanProduct = {
        ...productData,
        price: parseFloat(productData.price),
        discount_price: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
        is_visible: productData.isVisible ?? true,
        is_new_arrival: productData.isNewArrival ?? false,
        // Map frontend camelCase to snake_case if needed, but for now we'll match DB columns
        // Actually, let's map it properly to match the DB schema I just wrote
      };

      // We need to map camelCase (frontend) to snake_case (DB)
      const dbProduct = {
        name: cleanProduct.name,
        category: cleanProduct.category,
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
      setProducts((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const dbUpdate = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: parseFloat(updatedProduct.price),
        discount_price: updatedProduct.discountPrice ? parseFloat(updatedProduct.discountPrice) : null,
        description: updatedProduct.description,
        image: updatedProduct.image,
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
      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
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
    return products.filter((p) => p.category === category && p.is_visible);
  };

  const getNewArrivals = () => {
    return products.filter((p) => p.is_new_arrival && p.is_visible);
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
