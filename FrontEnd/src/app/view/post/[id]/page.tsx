import React from 'react';
import Link from 'next/link';
import { PostInfoType } from '@/lib/types';
import { FaArrowRight } from 'react-icons/fa';
import { formatDate, hapiApi } from '@/lib/client-utils';
import Image from 'next/image';
import MarkdownIt from 'markdown-it';
import {
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
  const { postData }: { postData: PostInfoType } = res.data;

  //parsing the markdown content
  const md = new MarkdownIt();
  const htmlOutput = md.render(postData.about);

  return (
    <>
      <header className="flex w-full flex-col">
        <nav className="nav-bar">
          <div>Logo</div>
          <Link href="/">
            <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
              <FaArrowRight />
            </button>
          </Link>
        </nav>

        <section className="heading">
          <div className="w-[85%] max-w-[700px]">
            <article className="flex justify-between p-1">
              <div>
                <p className="w-fit bg-accentPrimary px-2 py-1 text-bgPrimary">
                  {formatDate(postData.created_at)}
                </p>
                <h2 className="md-bold-text">{postData.title}</h2>
                <p className="sm-light-text">{postData.description}</p>
              </div>

              {/* user profile */}
              <div className="flex">
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
              </div>
            </article>
            <Image
              src={`${postData.image || '#'}`}
              alt={postData.title}
              width={800}
              height={400}
              className="rounded-md w-full border-2 border-accentPrimary bg-bgPrimary"
            />
          </div>
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

      <footer className="h-[70px] mb-10 flex justify-between px-2">
        <section className="flex gap-3 w-1/2 md:w-2/3 h-full my-2">
          <VoteSection post={postData} />
          <ViewsSection views={postData.views} />
        </section>

        {/* comment section */}
        <section className="border-2 border-red-500"></section>
      </footer>
    </>
  );
};
export default Page;
