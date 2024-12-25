import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { PostType } from '@/lib/types';
import { FaArrowRight } from 'react-icons/fa';
import { getBaseUrl } from '@/lib/server-utilis';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const postId = (await params).id;

  const baseUrl = await getBaseUrl();

  const res = await axios.get(`${baseUrl}/api/post`, {
    params: { postId },
  });
  const { postData }: { postData: PostType } = res.data;

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div>Logo</div>
          <Link href="/">
            <FaArrowRight />
          </Link>
        </nav>

        <section className="mb-5 flex w-full flex-col items-center justify-center gap-2 bg-bgSecondary py-2">
          <p className="border-2 border-accentPrimary px-2 py-1 text-accentPrimary">
            {/*{postData.createdAt}*/}
          </p>
          <h1>{postData.title}</h1>
        </section>
      </header>
      <main>
        <p>{postData.description}</p>
      </main>
    </>
  );
};
export default Page;
