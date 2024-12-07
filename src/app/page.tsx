import React, { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import NavBar from '@/components/NavBar';
import PostContainer from '@/components/postcomponents/PostContainer';
import { PopulatedPostType } from '@/lib/types';
import { headers } from 'next/headers';

const Page = async ({
                      searchParams,
                    }: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/allPosts`, {
    method: 'GET',
    next: { revalidate: 60 },
  });
  const data = await res.json();
  if (data.error) return <div> {data.error} </div>;
  const posts: PopulatedPostType[] = data.currPosts;

  return (
    <>
      <header className="w-full">
        <NavBar />
        <section className="mb-5 flex flex-col items-center justify-center gap-3 bg-bgSecondary py-3">
          <h1> Brain Storm your ides here </h1>
          <SearchBar query={query} />
        </section>
      </header>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <PostContainer query={query} posts={posts} />
        </Suspense>
      </main>
    </>
  );
};
export default Page;
