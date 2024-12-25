'use client';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import PostCard from '@/components/post-components/PostCard';
import { PopulatedPostType } from '@/lib/types';
import axios from 'axios';

const fetchPostsData = async (lastDate?: Date) => {
  const res = await axios.get('/api/allPosts', { params: { lastDate } });
  return res.data.currPosts;
};

export const DefaultPosts = ({ prevDate }: { prevDate: Date }) => {
  const { ref, inView } = useInView();

  const [lastDate, setLastDate] = useState<Date>(prevDate);
  const [allPosts, setAllPosts] = useState<PopulatedPostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (inView) {
      fetchPostsData(lastDate).then((data: PopulatedPostType[]) => {
        if (data.length === 0) {
          setLoading(false);
          return;
        }
        setAllPosts((prevPosts) => [...prevPosts, ...data]);
        setLastDate(data[data.length - 1].createdAt);
      });
    }
  }, [inView, lastDate]);

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
