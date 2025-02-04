import axios from "axios";

//function to format the date
export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

//axios instance
export const hapiApi = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
  withCredentials: true,
});

//function to convert file to image url
export function fileToImageUrl(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return null;
  return URL.createObjectURL(file);
}