import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gychcyxaupdhgeszcydb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y2hjeXhhdXBkaGdlc3pjeWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDY0MDcsImV4cCI6MjA1MDk4MjQwN30.ZgfLiD1Oeb_AyE3fMV8bSuyH0vmxIAHFxTq0SZV0kOk';

const supabase = createClient(supabaseUrl, supabaseKey);

//function to upload image to supabase storage
export const uploadImage = async (file: File | null) => {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from('post-image')
    .upload(fileName, file);
  if (error) {
    console.log('Error uploading file:', error.message);
    return null;
  }

  // Get the public URL of the uploaded image
  const {
    data: { publicUrl },
  } = supabase.storage.from('post-image').getPublicUrl(fileName);

  return publicUrl;
};

//function to delete image from supabase storage
export const deleteImage = async (imageUrls: string[]) => {
  if (!imageUrls || imageUrls.length === 0) {
    console.error('No image URLs provided to delete.');
    return false;
  }

  try {
    // Extract the file name from the URL
    const fileNames = imageUrls.map((url) => {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return decodeURIComponent(fileName); // Decode the filename
    });

    if (!fileNames) {
      console.error('Unable to extract the file name from the URL.');
      return;
    }

    // Delete the file from the 'post-image' bucket
    const { error } = await supabase.storage
      .from('post-image')
      .remove(fileNames);

    if (error) {
      console.error('Error deleting file:', error.message);
      return;
    }

    console.log(`File deleted successfully.`);
  } catch (error) {
    console.log('An error occurred while deleting the image:', error);
  }
};
