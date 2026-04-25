import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { uploadImage, deleteImage } from '../utils/storage';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
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
        // Safely parse JSON string fields
        const safeParse = (jsonString) => {
            if (typeof jsonString === 'string') {
                try {
                    const parsed = JSON.parse(jsonString);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    return [];
                }
            }
            return Array.isArray(jsonString) ? jsonString : [];
        };

        const details = safeParse(p.details);
        let gallery = safeParse(p.gallery).filter(img => img);
        const additionalCategories = safeParse(p.additional_categories);

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
          details: details,
          inStore: p.in_store,
          stockNumber: p.stock_number,
          gallery: gallery,
          availabilityStatus: p.availability_status || 'available',
          subcategory: p.subcategory,
          secondaryDescription: p.secondary_description,
          additionalCategories: additionalCategories
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
        stock_number: cleanProduct.stockNumber, 
        gallery: galleryUrls, 
        availability_status: cleanProduct.availabilityStatus, 
        secondary_description: cleanProduct.secondaryDescription, 
        additional_categories: cleanProduct.additionalCategories
      }; 

      const { data, error } = await supabase 
        .from('products') 
        .insert([dbProduct]) 
        .select(); // Removed .single() 

      if (error) throw error; 

      // Safety check: ensure Supabase gave us the saved row back 
      if (!data || data.length === 0) { 
         console.warn("Product inserted, but no data was returned."); 
         return { success: true }; // It saved, but we skip mapping the return 
      } 

      const returnedData = data[0]; // Safely grab the first item 

      // Map back to camelCase for state 
      const safeParse = (jsonString) => {
        if (typeof jsonString === 'string') {
            try {
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return Array.isArray(jsonString) ? jsonString : [];
      };
      
      const mappedData = { 
        ...returnedData, 
        discountPrice: returnedData.discount_price, 
        isVisible: returnedData.is_visible, 
        isNewArrival: returnedData.is_new_arrival, 
        showOnHome: returnedData.show_on_home, 
        brand: returnedData.brand, 
        modelName: returnedData.model_name, 
        modelNumber: returnedData.model_number, 
        hidePrice: returnedData.hide_price, 
        subTitle: returnedData.sub_title, 
        details: safeParse(returnedData.details), 
        inStore: returnedData.in_store, 
        stockNumber: returnedData.stock_number, 
        gallery: safeParse(returnedData.gallery), 
        availabilityStatus: returnedData.availability_status, 
        secondaryDescription: returnedData.secondary_description, 
        additionalCategories: safeParse(returnedData.additional_categories) 
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
       // Safety Check 
       if (!id) throw new Error("Attempted to update product, but ID is missing."); 
 
       const oldProduct = products.find(p => p.id === id); 
       let imageUrl = oldProduct?.image; 
 
       // 1. Handle Main Image Update 
       if (updatedProduct.imageFile) { 
         const newImageUrl = await uploadImage(updatedProduct.imageFile); 
         if (imageUrl && imageUrl !== newImageUrl) { 
           await deleteImage(imageUrl); 
         } 
         imageUrl = newImageUrl; 
       } 
 
       // 2 & 3. Handle Gallery Images (FIXED LOGIC) 
       let finalGalleryUrls = []; 
 
       // First, keep the existing gallery images that weren't deleted 
       if (updatedProduct.gallery) { 
         finalGalleryUrls = [...updatedProduct.gallery]; 
         
         // Cleanup storage for any images removed via the UI 
         const oldGallery = oldProduct?.gallery || []; 
         const imagesToDelete = oldGallery.filter(oldImg => !updatedProduct.gallery.includes(oldImg)); 
         
         if (oldProduct.image && !updatedProduct.gallery.includes(oldProduct.image) && oldProduct.image !== imageUrl) { 
             imagesToDelete.push(oldProduct.image); 
         } 
 
         const deletePromises = imagesToDelete.map(imgUrl => deleteImage(imgUrl)); 
         await Promise.all(deletePromises); 
       } else { 
         finalGalleryUrls = [...(oldProduct?.gallery || [])]; 
       } 
 
       // Next, upload brand new files and APPEND them to the list (No more overwriting!) 
       if (updatedProduct.galleryFiles && updatedProduct.galleryFiles.length > 0) { 
         const uploadPromises = Array.from(updatedProduct.galleryFiles).map(file => uploadImage(file)); 
         const newGalleryUrls = await Promise.all(uploadPromises); 
         finalGalleryUrls = [...finalGalleryUrls, ...newGalleryUrls]; 
       } 
 
       // 4. Ensure Main Image is in Gallery 
       if (imageUrl && !finalGalleryUrls.includes(imageUrl)) { 
         finalGalleryUrls.unshift(imageUrl); 
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
         gallery: finalGalleryUrls, // Using the safely combined list! 
         availability_status: updatedProduct.availabilityStatus, 
         secondary_description: updatedProduct.secondaryDescription, 
         additional_categories: updatedProduct.additionalCategories 
       }; 
 
       const { data, error } = await supabase 
         .from('products') 
         .update(dbUpdate) 
         .eq('id', id) 
         .select(); 
 
       if (error) throw error; 
 
       // Safety check 
       if (!data || data.length === 0) { 
         console.warn(`Product update executed, but no data returned to read for ID: ${id}`); 
         return { success: true }; 
       } 
 
       const returnedData = data[0]; 
 
       // 6. Map back to camelCase and update state 
      const safeParse = (jsonString) => {
        if (typeof jsonString === 'string') {
            try {
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return Array.isArray(jsonString) ? jsonString : [];
      };

       const mappedData = { 
         ...returnedData, 
         discountPrice: returnedData.discount_price, 
         isVisible: returnedData.is_visible, 
         isNewArrival: returnedData.is_new_arrival, 
         showOnHome: returnedData.show_on_home, 
         brand: returnedData.brand, 
         modelName: returnedData.model_name, 
         modelNumber: returnedData.model_number, 
         hidePrice: returnedData.hide_price, 
         subTitle: returnedData.sub_title, 
         details: safeParse(returnedData.details), 
         inStore: returnedData.in_store, 
         stockNumber: returnedData.stock_number, 
         gallery: safeParse(returnedData.gallery), 
         availabilityStatus: returnedData.availability_status, 
         secondaryDescription: returnedData.secondary_description, 
         additionalCategories: safeParse(returnedData.additional_categories) 
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