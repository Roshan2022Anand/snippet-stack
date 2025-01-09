'use client';
import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

//skeliton animation component
export const Skeliton = () => {
  useGSAP(() => {
    gsap.to('.animate', {
      translateX: '0%',
      duration: 2,
      repeat: -1,
      yoyo: true,
    });
  });
  return <div className="animate skeliton"></div>;
};

//skeliton for post form
export const PostFormSkeliton = () => {
  return (
    <form className="create-form flex flex-col w-[90%] max-w-[900px] mx-auto">
      <label>Title:</label>
      <div className="h-[20px] skeliton-parent">
        <Skeliton />
      </div>
      <label>Description:</label>
      <div className="h-[40px] skeliton-parent">
        <Skeliton />
      </div>
      <label>Poster:</label>
      <div className="h-[100px] w-[100px] skeliton-parent">
        <Skeliton />
      </div>
      <div className="h-[20px] mt-1 skeliton-parent">
        <Skeliton />
      </div>
      <label>Choose The Tech:</label>
      <div className="h-[20px] skeliton-parent">
        <Skeliton />
      </div>
      <label>Detailed Explanation:</label>
      <div className="h-[300px] skeliton-parent">
        <Skeliton />
      </div>
      <button className="w-full my-5 rounded-lg bg-accentPrimary p-1 px-5 border-2 border-textPrimary text-bgPrimary font-bold">
        Update
      </button>
    </form>
  );
};

//skeliton for nav bar
export const NavSkeliton = () => {
  return (
    <nav className="flex justify-between px-2 py-1">
      <div className="size-[50px] skeliton-parent">
        <Skeliton />
      </div>
      <div className="flex gap-3">
        <div className="size-[50px] skeliton-parent">
          <Skeliton />
        </div>
        <div className="size-[50px] skeliton-parent">
          <Skeliton />
        </div>
      </div>
    </nav>
  );
};

//skeliton for post card
const PostCardSkeliton = () => {
  return (
    <div className="border border-slate-300 h-[300px] sm:h-[400px] lg:h-[400px] skeliton-parent">
      <Skeliton />
    </div>
  );
};

//skeliton for post container
export const PostContainerSkeliton = () => {
  const skelitons = [];
  for (let i = 0; i < 4; i++) {
    skelitons.push(<PostCardSkeliton key={i} />);
  }
  return (
    <main className="w-[95vw] max-w-[1250px] mx-auto">
      <div className="hidden lg:grid grid-cols-2 gap-2 px-2">{skelitons}</div>
      <div className="lg:hidden">
        <PostCardSkeliton />
      </div>
    </main>
  );
};

//skeliton for user profile
export const UserProfileSkeliton = () => {
  return (
    <div className="w-[90%] max-w-[800px] flex gap-2">
      <div
        className="h-[100px] w-[100px] skeliton-parent "
        style={{ borderRadius: '50%' }}
      >
        <Skeliton />
      </div>
      <div className="w-1/2">
        <label>Name:</label>
        <div className="h-[20px] skeliton-parent w-full">
          <Skeliton />
        </div>
        <label>Bio:</label>
        <div className="h-[20px] skeliton-parent w-full">
          <Skeliton />
        </div>
      </div>
    </div>
  );
};
