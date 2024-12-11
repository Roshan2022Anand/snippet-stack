import React from 'react';
import { PopulatedPostType } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/client-utils';
import {
  CommentSection,
  ViewsSection,
  VoteSection,
} from '@/components/post-components/PostCardButtons';

const PostCard = ({ post }: { post: PopulatedPostType }) => {
  return (
    <article className="border-2 border-accentPrimary rounded-lg px-2 py-1 h-[300px] sm:h-[400px] lg:h-[400px]">
      <header className="flex gap-2 h-[15%]">
        <div className="border-4 border-accentPrimary rounded-full w-[60px]">
          <Image
            src={`${post.author.image}`}
            alt={`${post.author.name}`}
            width={100}
            height={100}
            className="w-full rounded-full"
          />
        </div>
        <div>
          <h3 className="sm-bold-text">{post.author.name}</h3>
          <p className="sm-light-text opacity-85">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </header>

      <main className="h-[70%]">
        <Link href={`/view/post/${post._id}`} className="size-full flex py-2">
          <section className="w-1/2 h-full">
            <p className="md-bold-text">{post.title}</p>
            <p className="sm-light-text">{post.description}</p>
          </section>
          <section className="w-1/2 h-full rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={10}
              height={5}
              className="w-full rounded-xl"
              loading="lazy"
            />
          </section>
        </Link>
      </main>

      <footer className="h-[15%] flex gap-3 w-1/2 md:w-2/3">
        <VoteSection />
        <CommentSection />
        <ViewsSection />
      </footer>
    </article>
  );
};
export default PostCard;
