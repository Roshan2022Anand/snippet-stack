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
import CommentsBox from '@/components/post-components/CommentsBox';

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
          <div className="w-[80%] max-w-[1000px] lg:flex flex-row-reverse justify-around gap-1">
            <article className="flex lg:flex-col-reverse lg:justify-evenly lg:w-1/2 justify-between p-1 backdrop-blur-[5px]">
              <div>
                <p className="w-fit bg-accentPrimary px-2 py-1 text-bgPrimary">
                  {formatDate(postData.created_at)}
                </p>
                <h2 className="md-bold-text">{postData.title}</h2>
                <p className="sm-light-text">{postData.description}</p>
              </div>

              {/* user profile */}
              <div className="w-1/2 flex items-start justify-end lg:flex-row-reverse gap-2">
                <p className="font-bold text-[30px]">{postData.fname}</p>
                {postData.pic && (
                  <Image
                    src={`${postData.pic}`}
                    alt={`${postData.fname}`}
                    width={100}
                    height={100}
                    className="rounded-full size-[70px]  object-cover border-2 border-accentPrimary"
                  />
                )}
              </div>
            </article>
            <div className="bg-bgPrimary size-full lg:size-[400px]  border-2 border-accentPrimary rounded-md overflow-hidden">
              <Image
                src={`${postData.image || '#'}`}
                alt={postData.title}
                width={300}
                height={300}
                className="object-cover size-full"
              />
            </div>
          </div>
        </section>
      </header>

      <main className="px-3 rounded-md mx-auto w-[85%] max-w-[800px]">
        {htmlOutput && (
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          ></article>
        )}
      </main>

      <footer className="h-[70px] w-[85%] mx-auto max-w-[800px] px-2">
        <section className="flex gap-3 w-1/2 h-full my-2 mb-12">
          <VoteSection post={postData} />
          <ViewsSection views={postData.views} />
        </section>

        {/* comment section */}
        <CommentsBox postID={postData.post_id} />
      </footer>
    </>
  );
};
export default Page;
