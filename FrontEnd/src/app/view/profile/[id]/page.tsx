import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaUser } from 'react-icons/fa';
import { hapiApi } from '@/lib/client-utils';
import { getCookies } from '@/lib/server-utils';
import { PostInfoType, UserType } from '@/lib/types';
import InfiniteScrolling from '@/components/utility-components/InfiniteScrolling';
import PostCard from '@/components/post-components/PostCard';
import Image from 'next/image';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const sessionValue = await getCookies();
  const userID = (await params).id;

  const otherUserRes = await hapiApi.get('/api/user', {
    params: { userID },
    headers: { cookie: `${sessionValue}` },
  });
  const { user }: { user: UserType } = otherUserRes.data;

  const authRes = await hapiApi.get('/api/auth', {
    headers: { cookie: `${sessionValue}` },
  });
  const session: UserType = authRes.data.user;

  const postRes = await hapiApi.get('/api/alluserposts', {
    headers: { cookie: `${sessionValue}` },
    params: { userID: user.user_id, lastID: 0 },
  });

  const posts: PostInfoType[] = postRes.data.posts;

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
          <h1>{user.fname} Profile</h1>
          <article className="w-1/2  flex gap-2 justify-around">
            <div className="bg-accentPrimary rounded-xl h-[100px] p-1 overflow-hidden">
              {user.pic && user.pic !== 'null' ? (
                <Image
                  src={`${user.pic}`}
                  alt="image"
                  height={100}
                  width={100}
                  className="size-full rounded-xl"
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="grow">
              <p className="border-b-2 border-accentPrimary w-fit text-[25px] font-bold">
                {user.fname}
              </p>
              <p className="text-[10px]">{user.bio}</p>
            </div>
          </article>
        </section>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
        {posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostCard
                key={`post-${index}`}
                post={post}
                authUserID={session.user_id}
              />
            ))}
            <InfiniteScrolling
              prevID={posts[posts.length - 1].post_id}
              userID={user.user_id}
              authUserID={session.user_id}
            />
          </>
        ) : (
          <p className="w-screen text-center font-bold text-[2vw]">
            no post found
          </p>
        )}
      </main>
    </>
  );
};
export default Page;
