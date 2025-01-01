import { cookies } from 'next/headers';

export const getCookies = async () => {
  const cookieStore = (await cookies()).getAll();
  const session = `${cookieStore[1].name}=${cookieStore[1].value}`; ;
  return session;
};
