import React from 'react';
import axios from 'axios';
import { getBaseUrl } from '@/lib/server-utilis';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const baseUrl = await getBaseUrl();

  const userID = (await params).id;
  const res = await axios.get(`${baseUrl}/api/user`,{params:{userID}});
  console.log(res.data,userID);
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
        </section>
      </header>
      <main>
      </main>
    </>
  );
};
export default Page;
