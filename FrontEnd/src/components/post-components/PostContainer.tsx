import React from 'react';
import { DefaultPosts } from '@/components/post-components/InfiniteScrolling';
import PostCard from '@/components/post-components/PostCard';
import { PopulatedPostType } from '@/lib/types';

const PostContainer = async ({
                               query,
                               posts,
                             }: {
  query?: string;
  posts: PopulatedPostType[];
}) => {
  if (query) {
    return <div>Searching for {query}</div>;
  }
  if (posts.length === 0) return <div className="md-bold-text w-full text-center text-textPrimary">No Posts Found</div>;
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 w-[95vw] max-w-[1250px] mx-auto">
      {posts.map((post, index) => (
        <PostCard key={`initial-${index}`} post={post} />
      ))}
      <DefaultPosts prevDate={posts[posts.length - 1].createdAt} />
    </section>
  );
};
export default PostContainer;
