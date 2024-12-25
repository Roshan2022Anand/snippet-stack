'use server';
import { headers } from 'next/headers';

//function to get the current url
export const getBaseUrl = async () => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
};
