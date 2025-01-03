import React from 'react';
import SearchBar from '@/components/search-bar-components/SearchBar';
import NavBar from '@/components/NavBar';
import { JoinPostUserType } from '@/lib/types';
import { hapiApi } from '@/lib/client-utils';
import PostCard from '@/components/post-components/PostCard';
import InfiniteScrolling from '@/components/utility-components/InfiniteScrolling';
import { getCookies } from '@/lib/server-utils';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  //fetching all the posts
  let posts: JoinPostUserType[];
  try {
    const res = await hapiApi.get('/api/allposts', {
      params: { query, lastID: 0 },
    });
    posts = res.data.posts;
  } catch (err) {
    console.log(err);
    return <div>Something went wrong, Please try again</div>;
  }

  //fetching the session data
  const sessionValue = await getCookies();
  let session;
  try {
    const res = await hapiApi.get('/api/auth', {
      headers: { cookie: `${sessionValue}` },
    });
    session = res.data.user;
  } catch (err) {
    console.log(err);
    session = null;
  }

  return (
    <>
      <header className="w-full">
        <NavBar session={session} />
        <section className="mb-5 flex flex-col items-center justify-center gap-3 bg-bgSecondary py-3">
          <h1> Find the Programming insights here</h1>
          <SearchBar query={query} />
        </section>
      </header>

      {/* showing all teh posts */}
      <main>
        {posts.length === 0 ? (
          <div className="md-bold-text w-full text-center text-textPrimary">
            No Posts Found
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
            {query && (
              <h2 className="md-bold-text text-textPrimary">
                Search result "{query}"
              </h2>
            )}
            {posts.map((post, index) => (
              <PostCard
                key={`initial-${index}`}
                post={post}
                authUserID={session?.user_id}
              />
            ))}
            <InfiniteScrolling
              prevID={posts[posts.length - 1].post_id}
              query={query}
              authUserID={session?.user_id}
            />
          </section>
        )}
      </main>
    </>
  );
};
export default Page;
