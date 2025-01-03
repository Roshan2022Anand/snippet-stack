'use client';
import React from 'react';
import { TiArrowDownOutline, TiArrowUpOutline } from 'react-icons/ti';
import { BiCommentDetail } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { hapiApi } from '@/lib/client-utils';

//component for voting the posts
export const VoteSection = () => {
  return (
    <div className="h-full btn-accent-one flex items-center grow-[2] justify-around">
      <button className="h-full">
        <TiArrowUpOutline className="size-2/3" />
      </button>
      <div className="w-[2px] h-2/3 bg-bgPrimary"></div>
      <button className="h-full">
        <TiArrowDownOutline className="size-2/3" />
      </button>
    </div>
  );
};

//component for commenting the posts
export const CommentSection = () => {
  return (
    <button className="btn-accent-one grow">
      <BiCommentDetail className="size-1/2 mx-auto" />
    </button>
  );
};

//component to show the views of the post
export const ViewsSection = () => {
  return (
    <button className="text-accentPrimary grow">
      <FaEye />
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
      if (axios.isAxiosError(err)) toast.success(err.response?.data);
    }
  };
  return (
    <button onClick={deletePost} className="h-full">
      <MdDeleteForever className="size-full p-2 text-red-500" />
    </button>
  );
};
