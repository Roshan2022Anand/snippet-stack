import React from 'react';
import axios from 'axios';
import { getBaseUrl } from '@/lib/server-utilis';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import UserProfileForm from '@/components/user-profile-components/UserProfileForm';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const baseUrl = await getBaseUrl();

  const userID = (await params).id;
  const res = await axios.get(`${baseUrl}/api/user`, { params: { userID } });
  const userData = res.data.currUser;
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
          <UserProfileForm userData={userData} />
        </section>
      </header>
      <main></main>
    </>
  );
};
export default Page;
