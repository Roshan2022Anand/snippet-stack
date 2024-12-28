import { auth, signIn, signOut } from '@/auth';
import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { IoIosLogIn, IoMdAdd } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';

export default async function NavBar() {
  // const res = await axios.get('http://localhost:5000/api/auth');
  // const session = res.data.user;
  // console.log(session);
  const session = null;
  return (
    <section className="nav-bar">
      <div className="font-bold text-accentPrimary">Logo</div>
      <nav className="flex w-1/2 justify-end gap-3">
        {session ? (
          <>
            <Link href="/create">
              <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
                <IoMdAdd className="size-full" />
              </button>
            </Link>
            <Link href="">
              <button className="btn-accent-one">hai</button>
            </Link>
          </>
        ) : (
          <Link href="/signup">
            <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
              <FaUserAlt className="size-full" />
            </button>
          </Link>
        )}
      </nav>
    </section>
  );
}
