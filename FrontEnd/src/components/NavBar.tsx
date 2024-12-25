import { auth, signIn, signOut } from '@/auth';
import React from 'react';
import Link from 'next/link';
import Form from 'next/form';
import { Session } from 'next-auth';
import axios from 'axios';
import Image from 'next/image';
import { IoIosLogIn, IoMdAdd } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';

const NavBar = async () => {
  const session: Session | null = await auth();


  let userID;
  if (session?.user) {
    const res = await axios.post("http://localhost:5000/api/user",{
      email: session.user.email as string,
      name: session.user.name as string,
      image: session.user.image as string,
    })
    if (res.data.id) userID = res.data.id;
    if (res.data.error) return null;
  }

  return (
    <section className="nav-bar">
      <div className="font-bold text-accentPrimary">Logo</div>
      {session?.user ? (
        <nav className="flex w-1/2 justify-end gap-3">
          <Link href="/create">
            <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
              <IoMdAdd className="size-full" />
            </button>
          </Link>
          <Form
            action={async (): Promise<void> => {
              'use server';
              await signOut();
            }}
          >
            <button
              type="submit"
              className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center"
            >
              <IoIosLogIn className="size-full" />
            </button>
          </Form>
          <Link href={`/profile/${userID}`}>
            <Image
              src={`${session.user.image}`}
              alt={`${session.user.name}`}
              width={100}
              height={100}
              className="size-[6vw] max-w-[50px] max-h-[50px] rounded-full border-4 border-accentPrimary"
              priority
            />
          </Link>
        </nav>
      ) : (
        <Form
          action={async () => {
            'use server';
            await signIn('github');
          }}
          className="mr-5"
        >
          <button
            type="submit"
            className="rounded-full border-2 bg-accentPrimary p-1 shadow-sm shadow-accentPrimary"
          >
            <FaGithub className="size-[5vw] max-w-[50px] max-h-[50px]" />
          </button>
        </Form>
      )}
    </section>
  );
};

export default NavBar;
