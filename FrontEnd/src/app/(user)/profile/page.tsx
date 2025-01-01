import React from 'react';
import Form from 'next/form';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import UserProfileForm from '@/components/user-profile-components/UserProfileForm';
import { hapiApi } from '@/lib/client-utils';
import { getCookies } from '@/lib/server-utils';
import { UserType } from '@/lib/types';
import SignOut from '@/components/user-profile-components/SignOut';

const Page = async () => {
  const sessionValue = await getCookies();

  const res = await hapiApi.get('/api/auth', {
    headers: { cookie: `${sessionValue}` },
  });
  const session: UserType = res.data.user;

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div>Logo</div>
          <button className="btn-accent-one">
            <Link href="/">
              <FaArrowRight />
            </Link>
          </button>
        </nav>

        <section className="mb-5 flex w-full flex-col items-center justify-center gap-2 bg-bgSecondary py-2">
          <h1>Your Profile</h1>
          <div className='w-full flex'>
            <UserProfileForm session={session} />
            <SignOut />
          </div>
        </section>
      </header>
      <main>
        form action to delete the user from db and signOut
        
      </main>
    </>
  );
};
export default Page;
