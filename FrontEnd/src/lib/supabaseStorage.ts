import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gychcyxaupdhgeszcydb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y2hjeXhhdXBkaGdlc3pjeWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDY0MDcsImV4cCI6MjA1MDk4MjQwN30.ZgfLiD1Oeb_AyE3fMV8bSuyH0vmxIAHFxTq0SZV0kOk'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file: any) => {
  
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('post-image')
    .upload(fileName, file);

  if (error) {
    console.log('Error uploading file:', error.message);
    return null;
  }

  // Get the public URL of the uploaded image
  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(fileName);

  return publicUrl;
};

//function to get all images
export const getImages = async () => {
  const { data, error } = await supabase.storage
    .from('images') // Replace 'images' with your bucket name
    .list();

  if (error) {
    console.error('Error retrieving files:', error.message);
    return [];
  }

  return data; // Returns an array of file objects
};
