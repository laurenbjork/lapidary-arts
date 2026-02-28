import { supabase } from '../supabase';

const BUCKET_NAME = 'product-images';

/**
 * Uploads an image to Supabase storage.
 *
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadImage = async (file) => {
  console.log('[storage.js] 1. Starting uploadImage function.');
  try {
    if (!file) {
      console.error('[storage.js] 2. No file provided for upload.');
      throw new Error('No file provided for upload.');
    }
    console.log('[storage.js] 2. File received:', file.name, file.type);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    console.log(`[storage.js] 3. Uploading to bucket: ${BUCKET_NAME}, path: ${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('[storage.js] 4. Supabase upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    console.log('[storage.js] 4. Supabase upload successful.');

    console.log('[storage.js] 5. Attempting to get public URL.');
    const publicUrlData = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log('[storage.js] 6. Data from getPublicUrl:', publicUrlData);

    if (!publicUrlData || !publicUrlData.data.publicUrl) {
      console.error('[storage.js] 7. Failed to get public URL from data. Data received:', publicUrlData);
      throw new Error('Failed to get public URL for the uploaded image.');
    }

    const publicUrl = publicUrlData.data.publicUrl;
    console.log('[storage.js] 8. Public URL retrieved:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('[storage.js] FINAL ERROR in uploadImage:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Deletes an image from Supabase storage.
 *
 * @param {string} imageUrl The public URL of the image to delete.
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.warn('No image URL provided for deletion.');
      return;
    }

    const bucketName = 'product-images';
    // Extract the file path from the public URL
    // e.g., https://<project>.supabase.co/storage/v1/object/public/product-images/some-file.jpg
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName) {
      throw new Error('Could not extract file name from the URL.');
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error('Supabase deletion error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }

  } catch (error) {
    console.error('Error deleting image:', error.message);
    // Decide if you want to throw an error that the calling function needs to handle
    // For now, we'll log it but not re-throw to avoid breaking UI flows
    // if a deletion fails. In a real app, you might want to handle this more gracefully.
  }
};
