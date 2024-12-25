import React from 'react';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import CreatePostForm from '@/components/post-components/CreatePostForm';
import { redirect } from 'next/navigation';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import Link from 'next/link';

const Page = async () => {
  const session: Session | null = await auth();
  if (!session) redirect('/');

  return (
    <>
      <header>
        <nav className="nav-bar">
          <div>logo</div>
          <button className="btn-accent-one h-2/3">
            <Link href="/">
              <FaArrowRightFromBracket className="size-full" />
            </Link>
          </button>
        </nav>
        <section className="mb-5 flex items-center justify-center bg-bgSecondary py-3">
          <h1>Create Your post</h1>
        </section>
      </header>
      <CreatePostForm session={session}/>;
    </>
  );
};
export default Page;
