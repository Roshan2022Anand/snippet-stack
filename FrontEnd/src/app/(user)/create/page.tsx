import React from 'react';
import CreatePostForm from '@/components/post-components/CreatePostForm';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import Link from 'next/link';

const Page = () => {
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
        <section className="heading">
          <h1>Create Your post</h1>
        </section>
      </header>
      <CreatePostForm />;
    </>
  );
};
export default Page;
