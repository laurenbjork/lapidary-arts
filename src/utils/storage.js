import { supabase } from '../supabase';

const BUCKET_NAME = 'product-images';

/**
 * Uploads an image to Supabase storage.
 *
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadImage = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to get public URL for the uploaded image.');
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    // Return a more user-friendly error or re-throw
    throw new Error('Image upload failed. Please try again.');
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
