import React from 'react';
import Link from 'next/link';
import { JoinPostUserType } from '@/lib/types';
import { FaArrowRight } from 'react-icons/fa';
import { formatDate, hapiApi } from '@/lib/client-utils';
import Image from 'next/image';
import MarkdownIt from 'markdown-it';
import {
  CommentSection,
  ViewsSection,
  VoteSection,
} from '@/components/post-components/PostCardButtons';
import { getCookies } from '@/lib/server-utils';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const postId = (await params).id;

  const sessionValue = await getCookies();

  //fetching the post based on postId
  const res = await hapiApi.get('/api/post', {
    headers: { cookie: `${sessionValue}` },
    params: { postId },
  });
  const { postData }: { postData: JoinPostUserType } = res.data;

  //parsing the markdown content
  const md = new MarkdownIt();
  const htmlOutput = md.render(postData.about);

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div>Logo</div>
          <Link href="/">
          <button className='btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center'>
            <FaArrowRight />
          </button>
          </Link>
        </nav>

        <section className="px-2 mb-5 flex w-full flex-col md:flex-row-reverse gap-2 bg-bgSecondary py-2">
          <article className="flex flex-col justify-around">
            <section>
              <p className="w-fit bg-accentPrimary px-2 py-1 text-bgPrimary">
                {formatDate(postData.created_at)}
              </p>
              <h2 className="md-bold-text">{postData.title}</h2>
              <p className="sm-light-text">{postData.description}</p>
            </section>

            {/* user profile */}
            <section className="flex">
              <h3 className="sm-bold-text text-[3vw]">{postData.fname}</h3>
              {postData.pic && (
                <Image
                  src={`${postData.pic}`}
                  alt={`${postData.fname}`}
                  width={100}
                  height={100}
                  className="rounded-full size-[50px] border-2 border-accentPrimary"
                />
              )}
            </section>
          </article>
          <Image
            src={`${postData.image || '#'}`}
            alt={postData.title}
            width={800}
            height={400}
            className="rounded-md border-2 border-accentPrimary bg-bgPrimary"
          />
        </section>
      </header>

      <main className="px-3 rounded-md bg-slate-200 mx-2">
        {htmlOutput && (
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          ></article>
        )}
      </main>

      <footer className="h-[50px] w-2/3 flex justify-center gap-3 m-2">
        <VoteSection />
        <CommentSection />
        <ViewsSection />
      </footer>
    </>
  );
};
export default Page;
