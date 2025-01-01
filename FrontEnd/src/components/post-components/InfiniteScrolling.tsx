'use client';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import PostCard from '@/components/post-components/PostCard';
import axios from 'axios';
import { JoinPostUserType } from '@/lib/types';

export const DefaultPosts = ({
  prevID,
  query,
}: {
  prevID: number;
  query?: string;
}) => {
  const { ref, inView } = useInView();
  const [lastID, setLastID] = useState<number>(prevID);
  const [allPosts, setAllPosts] = useState<JoinPostUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to show more posts
    const showMorePosts = async () => {
      const res = await axios.get('http://localhost:5000/api/allposts', {
        params: { query, lastID },
      });
      const posts: JoinPostUserType[] = res.data;
      if (posts.length === 0) {
        setLoading(false);
        return;
      }
      setAllPosts((prevPosts) => [...prevPosts, ...posts]);
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
