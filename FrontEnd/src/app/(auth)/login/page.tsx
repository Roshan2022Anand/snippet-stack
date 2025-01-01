'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { hapiApi } from '@/lib/client-utils';

const page = () => {
  const router = useRouter();
  const [err, seterr] = useState<{ isErr: boolean; msg: string }>({
    isErr: false,
    msg: '',
  });

  //function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await hapiApi.get(`/api/login`, {
        params: {
          email,
          password,
        },
      });
      toast.success(res.data.message);
      router.push('/');
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <main className=" w-full h-screen flex items-center bg-bgPrimary justify-between">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col py-1 rounded-lg px-3 mx-auto sm:ml-auto"
      >
        <h2 className="font-bold border-b-2 border-textPrimary">Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="input-field"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="input-field"
          required
        />

        {err.isErr && <p className="text-red-500">{err.msg}</p>}

        <button
          type="submit"
          className="btn-accent-one mt-2 border-2 border-textPrimary"
        >
          Login
        </button>
        <p>
          New to snippet stack ?
          <Link
            href="/signup"
            className="text-blue-600 decoration-blue-600 underline"
          >
            Sign up
          </Link>
        </p>
      </form>
      <div className="h-full w-1/2 bg-bgSecondary hidden sm:block"></div>
    </main>
  );
};

export default page;
