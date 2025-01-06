'use client';
import { formatDate, hapiApi } from '@/lib/client-utils';
import { CommentType, UserType } from '@/lib/types';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CommentsBox = ({ postID }: { postID: number }) => {
  const replyRef = useRef<HTMLInputElement>(null);

  const [comments, setcomments] = useState<CommentType[]>([]);
  const [user, setuser] = useState<UserType>();
  const [loading, setloading] = useState<boolean>(false);
  //to get comments and user details
  useEffect(() => {
    const getComments = async () => {
      const authRes = await hapiApi.get('/api/auth');
      const res = await hapiApi.get('/api/comment', { params: { postID } });
      setuser(authRes.data.user);
      setcomments(res.data.rows);
    };
    getComments();
  }, []);

  //function to add comment
  const addComment = async () => {
    setloading(true);
    const reply = replyRef.current;
    if (reply && reply.value && user) {
      try {
        const res = await hapiApi.post(`/api/comment`, {
          postID,
          reply: reply.value,
        });
        toast.success(res.data.message);
        setcomments([
          {
            pic: user.pic,
            fname: user.fname,
            user_id: user.user_id,
            fcontent: reply.value,
            created_at: new Date(),
          },
          ...comments,
        ]);
      } catch (err) {
        if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
      } finally {
        console.log('hai');
        reply.value = '';
      }
    }
    setloading(false);
  };

  return (
    <section className="p-2 mb-12 border-2 border-accentPrimary">
      {user ? (
        <>
          <div className=" flex justify-evenly gap-1 items-center border-b-2 border-accentPrimary">
            <div className="border-2 border-accentPrimary size-[65px] overflow-hidden rounded-full">
              {user.pic && user.pic !== 'null' ? (
                <Image
                  src={`${user.pic}`}
                  alt="image"
                  height={100}
                  width={100}
                  className="object-cover"
                />
              ) : (
                <FaUser className="size-full bg-accentPrimary p-2" />
              )}
            </div>
            <input
              type="text"
              placeholder="post your reply"
              className="grow h-1/2 focus:outline-none border-b-2 border-b-slate-400"
              ref={replyRef}
            />
            <button className="btn-accent-one h-fit" onClick={addComment}>
              {loading ? 'loading' : 'reply'}
            </button>
          </div>
          <article className="flex flex-col gap-2 mt-2">
            {comments.map((comment, index) => (
              <div
                key={`${comment.fname}-${index}`}
                className="flex gap-2 border-b-2 border-accentPrimary"
              >
                <div className="border-2 border-accentPrimary size-[50px] overflow-hidden rounded-full">
                  {user.pic && user.pic !== 'null' ? (
                    <Image
                      src={`${user.pic}`}
                      alt="image"
                      height={100}
                      width={100}
                      className="object-cover"
                    />
                  ) : (
                    <FaUser className="size-full bg-accentPrimary p-2" />
                  )}
                </div>
                <div>
                  <div className="flex gap-2 ">
                    <p className="font-bold">{comment.fname}</p>
                    <p className="opacity-60">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <p className="opacity-80">{comment.fcontent}</p>
                </div>
              </div>
            ))}
          </article>
        </>
      ) : (
        <div>Loading</div>
      )}
    </section>
  );
};

export default CommentsBox;
