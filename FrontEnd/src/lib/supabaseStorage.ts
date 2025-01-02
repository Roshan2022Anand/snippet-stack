import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gychcyxaupdhgeszcydb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y2hjeXhhdXBkaGdlc3pjeWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDY0MDcsImV4cCI6MjA1MDk4MjQwN30.ZgfLiD1Oeb_AyE3fMV8bSuyH0vmxIAHFxTq0SZV0kOk'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey);

//function to upload image to supabase storage
export const uploadImage = async (file: File | null) => {
  if (!file) return null;
  
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('post-image')
    .upload(fileName, file);
  console.log(data);
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
