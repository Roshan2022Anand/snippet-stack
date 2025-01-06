'use client';
import React, { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { hapiApi } from '@/lib/client-utils';
import { PostInfoType } from '@/lib/types';
import { FaDownLong, FaUpLong } from 'react-icons/fa6';
import { TbArrowBigDown, TbArrowBigUp } from 'react-icons/tb';
import { deleteImage } from '@/lib/supabaseStorage';
import { LuLoader } from 'react-icons/lu';

//component for voting the posts
export const VoteSection = ({ post }: { post: PostInfoType }) => {
  const { up_votes, down_votes, voted, post_id } = post;
  const [up, setup] = useState<number>(up_votes);
  const [down, setdown] = useState<number>(down_votes);
  const [isVoted, setisVoted] = useState(voted);

  const sendVoteResult = async (vote: number) => {
    const voteType: boolean = Boolean(vote);
    setisVoted(vote);
    try {
      const res = await hapiApi.put('/api/vote', { voteType, post_id });
      setup(res.data.up_votes);
      setdown(res.data.down_votes);
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
      setisVoted(Number(!vote));
    }
  };

  return (
    <div className="bg-accentPrimary flex items-center grow-[2] justify-evenly rounded-md">
      <button className="h-fit w-[45%] flex items-end text-white">
        {isVoted == 1 ? (
          <FaUpLong className="size-[50%]" />
        ) : (
          <TbArrowBigUp
            className="size-2/3"
            onClick={() => {
              sendVoteResult(1);
            }}
          />
        )}
        <p>{up}</p>
      </button>
      <div className="w-[2px] h-2/3 bg-bgPrimary"></div>
      <button className="h-fit w-[45%] flex items-end text-white">
        {isVoted == 0 ? (
          <FaDownLong className="size-[50%]" />
        ) : (
          <TbArrowBigDown
            className="size-2/3"
            onClick={() => {
              sendVoteResult(0);
            }}
          />
        )}
        <p>{down}</p>
      </button>
    </div>
  );
};

//component for commenting the posts
export const CommentSection = ({ comments }: { comments: number }) => {
  return (
    <>
      <BiCommentDetail className="size-full" />
      <p>{comments}</p>
    </>
  );
};

//component to show the views of the post
export const ViewsSection = ({ views }: { views: number }) => {
  return (
    <button className="text-accentPrimary grow flex items-center">
      <FaEye className="size-1/2" />
      <p className="text-[15px]">{views}</p>
    </button>
  );
};

//component to delete the post
export const DeletePostSection = ({
  postID,
  imgUrl,
}: {
  postID: number;
  imgUrl: string;
}) => {
  const [loading, setloading] = useState<boolean>(false);
  const deletePost = async () => {
    setloading(true);
    const postEle = document.getElementById(`post-${postID}`);
    try {
      const res = await hapiApi.delete('/api/post', { data: { postID } });
      await deleteImage([imgUrl]);
      postEle?.remove();
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) toast.error(err.response?.data);
    }
  };
  return (
    <button onClick={deletePost} className="h-full">
      {loading ? (
        <LuLoader className="size-full p-2 animate-spin text-accentPrimary" />
      ) : (
        <MdDeleteForever className="size-full p-2 text-red-500" />
      )}
    </button>
  );
};
