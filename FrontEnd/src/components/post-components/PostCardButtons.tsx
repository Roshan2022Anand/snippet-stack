'use client';
import React from 'react';
import { TiArrowDownOutline, TiArrowUpOutline } from 'react-icons/ti';
import { BiCommentDetail } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { hapiApi } from '@/lib/client-utils';
import { PostInfoType } from '@/lib/types';

//component for voting the posts
export const VoteSection = ({ post }: { post: PostInfoType }) => {
  const { up_votes, down_votes, voted } = post;

  return (
    <div className="h-full btn-accent-one flex items-center grow-[2] justify-evenly">
      <button className="h-fit w-[45%] flex items-end">
        <TiArrowUpOutline className="size-2/3 " />
        <p>{up_votes}</p>
      </button>
      <div className="w-[2px] h-2/3 bg-bgPrimary"></div>
      <button className="h-fit w-[45%] flex items-end">
        <TiArrowDownOutline className="size-2/3" />
        <p>{down_votes}</p>
      </button>
    </div>
  );
};

//component for commenting the posts
export const CommentSection = ({ comments }: { comments: number }) => {
  return (
    <button className="btn-accent-one grow flex items-end">
      <BiCommentDetail className="size-full" />
      <p>{comments}</p>
    </button>
  );
};

//component to show the views of the post
export const ViewsSection = ({ views }: { views: number }) => {
  return (
    <button className="text-accentPrimary grow flex items-center">
      <FaEye className='size-1/2'/>
      <p className='text-[15px]'>{views}</p>
    </button>
  );
};

//component to delete the post
export const DeletePostSection = ({ postID }: { postID: number }) => {
  const deletePost = async () => {
    try {
      const res = await hapiApi.delete('/api/post', { data: { postID } });
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) toast.error(err.response?.data);
    }
  };
  return (
    <button onClick={deletePost} className="h-full">
      <MdDeleteForever className="size-full p-2 text-red-500" />
    </button>
  );
};
