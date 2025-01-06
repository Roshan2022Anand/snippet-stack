import CreatePostForm from '@/components/post-components/CreatePostForm';
import Link from 'next/link';
import React from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

const page = async ({ params }: { params: Promise<{ id: number }> }) => {
  //get id from url
  const { id } = await params;

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
          <h1>Update Your post</h1>
        </section>
      </header>
      <CreatePostForm id={id} />
    </>
  );
};

export default page;
