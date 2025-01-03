import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import UserProfileForm from '@/components/user-profile-components/UserProfileForm';
import { hapiApi } from '@/lib/client-utils';
import { getCookies } from '@/lib/server-utils';
import { JoinPostUserType, UserType } from '@/lib/types';
import SignOut from '@/components/user-profile-components/SignOut';
import InfiniteScrolling from '@/components/utility-components/InfiniteScrolling';
import PostCard from '@/components/post-components/PostCard';

const Page = async () => {
  const sessionValue = await getCookies();

  const authRes = await hapiApi.get('/api/auth', {
    headers: { cookie: `${sessionValue}` },
  });
  const session: UserType = authRes.data.user;

  const postRes = await hapiApi.get('/api/alluserposts', {
    headers: { cookie: `${sessionValue}` },
    params: { userID: session.user_id, lastID: 0 },
  });

  const posts: JoinPostUserType[] = postRes.data.posts;

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
          <div className="w-full flex">
            <UserProfileForm session={session} />
            <SignOut />
          </div>
        </section>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
        {posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostCard
                key={`initial-${index}`}
                post={post}
                authUserID={session.user_id}
              />
            ))}
            <InfiniteScrolling
              prevID={posts[posts.length - 1].post_id}
              userID={session.user_id}
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
