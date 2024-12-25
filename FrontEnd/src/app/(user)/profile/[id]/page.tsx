import React from 'react';
import axios from 'axios';
import Form from 'next/form';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import UserProfileForm from '@/components/user-profile-components/UserProfileForm';
import { auth, signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
  const userID = (await params).id;
  const res = await axios.get('http://localhost:5000/api/user', {
    params: { userID },
  });
  const userData = res.data.userData;

if(!userData) redirect('/');

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
      <main>
        <Form
          action={async (): Promise<void> => {
            'use server';
            await axios.delete('http://localhost:5000/api/user', {
              params: { userID },
            });
            await signOut();
            redirect('/');
          }}
        >
          <button
            type="submit"
            className="bg-red-500 rounded-md px-2 py-1 mx-auto text-white"
          >
            Delete Account
          </button>
        </Form>
      </main>
    </>
  );
};
export default Page;
