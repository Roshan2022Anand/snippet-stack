import React, { Suspense } from 'react';
import SearchBar from '@/components/search-bar-components/SearchBar';
import NavBar from '@/components/NavBar';
import PostContainer from '@/components/post-components/PostContainer';
import { PostContainerSkeliton } from '@/components/Skelitons';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;
  // const res = await fetch(`${baseUrl}/api/allPosts`, {
  //   method: 'GET',
  //   next: { revalidate: 60 },
  // });
  // const data = await res.json();
  // const posts: PopulatedPostType[] | undefined = data.currPosts;
  return (
    <>
      <header className="w-full">
        <NavBar />
        <section className="mb-5 flex flex-col items-center justify-center gap-3 bg-bgSecondary py-3">
          <h1> Brain Storm your ides here </h1>
          <SearchBar query={query} />
        </section>
      </header>
      {/* <main>
        {posts ? (
          <Suspense fallback={<div>Loading...</div>}>
            <PostContainer query={query} posts={posts} />
          </Suspense>
        ) : (
          <PostContainerSkeliton />
        )}
      </main> */}
    </>
  );
};
export default Page;
