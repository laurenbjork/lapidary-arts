import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

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
      
      const mappedProducts = (data || []).map(p => {
        const gallery = (p.gallery || []).filter(img => img);

        // Inject main image if it's missing from the gallery
        if (p.image && !gallery.includes(p.image)) {
            gallery.unshift(p.image);
        }

        return {
          ...p,
          discountPrice: p.discount_price,
          isVisible: p.is_visible,
          isNewArrival: p.is_new_arrival,
          showOnHome: p.show_on_home,
          brand: p.brand,
          modelName: p.model_name,
          modelNumber: p.model_number,
          hidePrice: p.hide_price,
          subTitle: p.sub_title,
          details: p.details || [],
          inStore: p.in_store,
          stockNumber: p.stock_number,
          gallery: gallery, // Use the potentially modified gallery
          availabilityStatus: p.availability_status || 'available',
          subcategory: p.subcategory,
          secondaryDescription: p.secondary_description,
          additionalCategories: p.additional_categories || []
        };
      });
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };



  const addProduct = async (product) => {
    try {
      let imageUrl = product.image;

      // Upload image if it's a File object (not a string URL)
      if (product.imageFile) {
        imageUrl = await uploadImage(product.imageFile);
      }

      // Handle Gallery Images
      let galleryUrls = product.gallery || [];
      if (product.galleryFiles && product.galleryFiles.length > 0) {
        // CRITICAL FIX: Convert FileList to Array before using .map()
        const uploadPromises = Array.from(product.galleryFiles).map(file => uploadImage(file));
        const newGalleryUrls = await Promise.all(uploadPromises);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }
      // Ensure main image is in gallery if not already (optional, but good for UI)
      if (imageUrl && !galleryUrls.includes(imageUrl)) {
          galleryUrls = [imageUrl, ...galleryUrls];
      }

      // Remove temporary ID/file if present
      const { id, imageFile, galleryFiles, ...productData } = product;
      
      const cleanProduct = {
        ...productData,
        price: parseFloat(productData.price),
        discount_price: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
        description: productData.description,
        image: imageUrl,
        is_visible: productData.isVisible ?? true,
        is_new_arrival: productData.isNewArrival ?? false,
        show_on_home: productData.showOnHome ?? false,
        brand: productData.brand || null,
        model_name: productData.modelName || null,
        model_number: productData.modelNumber || null,
        hide_price: productData.hidePrice ?? false,
        sub_title: productData.subTitle || null,
        details: productData.details || [],
        in_store: productData.inStore ?? false,
        stock_number: productData.stockNumber || null,
        gallery: galleryUrls,
        availability_status: productData.availabilityStatus || 'available',
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
        is_new_arrival: cleanProduct.is_new_arrival,
        show_on_home: cleanProduct.show_on_home,
        brand: cleanProduct.brand,
        model_name: cleanProduct.model_name,
        model_number: cleanProduct.model_number,
        hide_price: cleanProduct.hide_price,
        sub_title: cleanProduct.sub_title,
        details: cleanProduct.details,
        in_store: cleanProduct.in_store,
        stock_number: cleanProduct.stock_number,
        gallery: galleryUrls,
        availability_status: cleanProduct.availability_status,
        secondary_description: cleanProduct.secondaryDescription,
        additional_categories: cleanProduct.additionalCategories
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) throw error;

      // Map back to camelCase for state
      const mappedData = {
        ...data,
        discountPrice: data.discount_price,
        isVisible: data.is_visible,
        isNewArrival: data.is_new_arrival,
        showOnHome: data.show_on_home,
        brand: data.brand,
        modelName: data.model_name,
        modelNumber: data.model_number,
        hidePrice: data.hide_price,
        subTitle: data.sub_title,
        details: data.details || [],
        inStore: data.in_store,
        stockNumber: data.stock_number,
        gallery: data.gallery || [],
        availabilityStatus: data.availability_status,
        secondaryDescription: data.secondary_description,
        additionalCategories: data.additional_categories || []
      };

      setProducts((prev) => [mappedData, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const oldProduct = products.find(p => p.id === id);
      let imageUrl = oldProduct?.image;
      let galleryUrls = oldProduct?.gallery || [];

      // 1. Handle Main Image Update
      if (updatedProduct.imageFile) {
        const newImageUrl = await uploadImage(updatedProduct.imageFile);
        // If there was an old image and it's different from the new one, delete it
        if (imageUrl && imageUrl !== newImageUrl) {
          await deleteImage(imageUrl);
        }
        imageUrl = newImageUrl;
      }

      // 2. Handle Gallery Files Upload
      if (updatedProduct.galleryFiles && updatedProduct.galleryFiles.length > 0) {
        // CRITICAL FIX: Convert FileList to Array
        const uploadPromises = Array.from(updatedProduct.galleryFiles).map(file => uploadImage(file));
        const newGalleryUrls = await Promise.all(uploadPromises);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      // 3. Handle Gallery URL Updates (from Admin UI)
      // This assumes updatedProduct.gallery is the complete, desired state of the gallery URLs
      if (updatedProduct.gallery) {
        const oldGallery = oldProduct?.gallery || [];
        const newGallery = updatedProduct.gallery;

        // Find images that were in the old gallery but are not in the new one
        const imagesToDelete = oldGallery.filter(oldImg => !newGallery.includes(oldImg));
        
        // Also check if the old main image was removed via the gallery UI
        if (oldProduct.image && !newGallery.includes(oldProduct.image) && oldProduct.image !== imageUrl) {
            imagesToDelete.push(oldProduct.image);
        }

        const deletePromises = imagesToDelete.map(imgUrl => deleteImage(imgUrl));
        await Promise.all(deletePromises);
        
        galleryUrls = newGallery; // Trust the new gallery state from the UI
      }

      // 4. Ensure Main Image is in Gallery
      if (imageUrl && !galleryUrls.includes(imageUrl)) {
        galleryUrls.unshift(imageUrl);
      }

      // 5. Prepare and Update Database
      const dbUpdate = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        subcategory: updatedProduct.subcategory || null,
        price: parseFloat(updatedProduct.price),
        discount_price: updatedProduct.discountPrice ? parseFloat(updatedProduct.discountPrice) : null,
        description: updatedProduct.description,
        image: imageUrl,
        is_visible: updatedProduct.isVisible,
        is_new_arrival: updatedProduct.isNewArrival,
        show_on_home: updatedProduct.showOnHome,
        brand: updatedProduct.brand,
        model_name: updatedProduct.modelName,
        model_number: updatedProduct.modelNumber,
        hide_price: updatedProduct.hidePrice,
        sub_title: updatedProduct.subTitle,
        details: updatedProduct.details,
        in_store: updatedProduct.inStore,
        stock_number: updatedProduct.stockNumber,
        gallery: galleryUrls,
        availability_status: updatedProduct.availabilityStatus,
        secondary_description: updatedProduct.secondaryDescription,
        additional_categories: updatedProduct.additionalCategories
      };

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 6. Map back to camelCase and update state
      const mappedData = {
        ...data,
        discountPrice: data.discount_price,
        isVisible: data.is_visible,
        isNewArrival: data.is_new_arrival,
        showOnHome: data.show_on_home,
        brand: data.brand,
        modelName: data.model_name,
        modelNumber: data.model_number,
        hidePrice: data.hide_price,
        subTitle: data.sub_title,
        details: data.details || [],
        inStore: data.in_store,
        stockNumber: data.stock_number,
        gallery: data.gallery || [],
        availabilityStatus: data.availability_status,
        secondaryDescription: data.secondary_description,
        additionalCategories: data.additional_categories || []
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
    return products.filter((p) => {
      if (!p.isVisible) return false;
      
      const mainMatch = p.category?.toLowerCase() === category?.toLowerCase();
      if (mainMatch) return true;

      const additionalMatch = (p.additionalCategories || []).some(
        ac => ac.category?.toLowerCase() === category?.toLowerCase()
      );
      return additionalMatch;
    });
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
