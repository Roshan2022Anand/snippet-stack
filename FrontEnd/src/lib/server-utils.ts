import { cookies } from 'next/headers';

//function to get the cookies
export const getCookies = async () => {
  const sessionObj= (await cookies()).get('session');
  const session = `${sessionObj?.name}=${sessionObj?.value}`; ;
  return session;
};
