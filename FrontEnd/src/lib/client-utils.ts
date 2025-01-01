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
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URI}`,
  withCredentials: true,
});