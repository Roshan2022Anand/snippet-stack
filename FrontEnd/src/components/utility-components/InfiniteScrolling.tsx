'use client';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import PostCard from '@/components/post-components/PostCard';
import { JoinPostUserType } from '@/lib/types';
import { hapiApi } from '@/lib/client-utils';

const InfiniteScrolling = ({
  prevID,
  query,
  userID,
}: {
  prevID: number;
  query?: string;
  userID?: number;
}) => {
  const { ref, inView } = useInView();
  const [lastID, setLastID] = useState<number>(prevID);
  const [allPosts, setAllPosts] = useState<JoinPostUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to show more posts
    const showMorePosts = async () => {
      let posts: JoinPostUserType[] = [];
      try {
        // Get the posts based on the query (for home page) or userID (for profile page)
        if (userID) {
          const res = await hapiApi.get('/api/alluserposts', {
            params: { userID, lastID },
          });
          posts = res.data.posts;
        } else {
          const res = await hapiApi.get('/api/allposts', {
            params: { query, lastID },
          });
          posts = res.data.posts;
        }

        // If no posts are found, stop the loader
        if (posts.length === 0) {
          setLoading(false);
          return;
        }
        setAllPosts((prevPosts) => [...prevPosts, ...posts]);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
      setLastID(posts[posts.length - 1].post_id);
    };

    //triggered when the loader is in view
    if (inView) {
      showMorePosts();
    }
  }, [inView, lastID, query]);

  return (
    <>
      {allPosts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
      <div ref={ref} className="h-10 w-screen text-center">
        {loading ? (
          <div className="mx-auto h-full w-10 animate-spin rounded-full border-b-2 border-r-2 border-bgSecondary"></div>
        ) : (
          <div className="text-center text-bgSecondary">
            No more posts to show
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteScrolling;
