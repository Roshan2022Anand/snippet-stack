import React from 'react';
import Link from 'next/link';
import { IoMdAdd } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { UserType } from '@/lib/types';

export default async function NavBar({session}: {session: UserType}) {
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

            <Link href={`/profile`}>
              <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center text-[10px]">
                {session.fname}
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signup">
              <button className="btn-accent-one flex size-[6vw] max-w-[50px] max-h-[50px] items-center justify-center">
                <FaUserAlt className="size-full" />
              </button>
            </Link>
          </>
        )}
      </nav>
    </section>
  );
}
