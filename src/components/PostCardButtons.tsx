import React from 'react';
import { TiArrowDownOutline, TiArrowUpOutline } from 'react-icons/ti';
import { BiCommentDetail } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';

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

export const CommentSection = () => {
  return (
    <button className="btn-accent-one grow">
      <BiCommentDetail className="size-1/2 mx-auto" />
    </button>
  );
};

export const ViewsSection = () => {
  return (
    <button className="text-accentPrimary grow">
      <FaEye />
    </button>
  );
};
