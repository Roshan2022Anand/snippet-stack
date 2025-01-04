import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/client-utils';
import {
  CommentSection,
  DeletePostSection,
  ViewsSection,
  VoteSection,
} from '@/components/post-components/PostCardButtons';
import { PostInfoType } from '@/lib/types';
import { FaUser } from 'react-icons/fa';

const PostCard = ({
  post,
  authUserID,
}: {
  post: PostInfoType;
  authUserID?: number;
}) => {
  return (
    <article className="border-2 border-accentPrimary rounded-lg px-2 py-1 h-[300px] sm:h-[400px] lg:h-[400px]">
      <header className="flex gap-2 h-[15%]">
        <Link
          href={
            authUserID === post.user_id
              ? '/profile'
              : `/view/profile/${post.user_id}`
          }
          className="flex gap-2"
        >
          <div className="border-4 border-accentPrimary rounded-full w-[60px]">
            {post.pic && post.pic !== 'null' ? (
              <Image
                src={`${post.pic}`}
                alt={`${post.fname}`}
                width={100}
                height={100}
                className="h-full object-cover object-top rounded-full"
              />
            ) : (
              <FaUser className="size-full p-2 text-accentPrimary" />
            )}
          </div>
          <div>
            <h3 className="sm-bold-text">{post.fname}</h3>
            <p className="sm-light-text opacity-85">
              {formatDate(post.created_at)}
            </p>
          </div>
        </Link>
      </header>

      <main className="h-[70%]">
        <Link
          href={`/view/post/${post.post_id}`}
          className="size-full flex py-2"
        >
          <section className="w-1/2 h-full">
            <p className="md-bold-text">{post.title}</p>
            <p className="sm-light-text">{post.description}</p>
          </section>
          <section className="w-1/2 h-full rounded-lg overflow-hidden border-2 border-accentPrimary">
            <Image
              src={`${post.image}`}
              alt={post.title}
              width={200}
              height={200}
              className="object-cover w-full rounded-xl"
              loading="lazy"
            />
          </section>
        </Link>
      </main>

      <footer className="h-[15%] flex justify-between">
        <section className="flex gap-3 w-1/2 md:w-2/3 h-full">
          <VoteSection post={post} />
          <CommentSection comments={post.comments} />
          <ViewsSection views={post.views} />
        </section>
        <section>
          {authUserID === post.user_id && (
            <DeletePostSection postID={post.post_id} />
          )}
        </section>
      </footer>
    </article>
  );
};
export default PostCard;
