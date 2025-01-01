'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { hapiApi } from '@/lib/client-utils';
import axios from 'axios';

const Page = () => {
  const router = useRouter();
  const [err, seterr] = useState<{ isErr: boolean; msg: string }>({
    isErr: false,
    msg: '',
  });

  //function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      seterr({ isErr: true, msg: 'Passwords do not match' });
      return;
    }

    try {
      const res = await hapiApi.post(`/api/signup`, {
        email,
        password,
        name,
      });
      toast.success(res.data.message);
      router.push('/');
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
  };

  return (
    <main className=" w-full h-screen flex items-center bg-bgPrimary">
      <div className="h-full w-1/2 bg-bgSecondary"></div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col px-2 py-1 rounded-lg"
      >
        <h2 className="font-bold border-b-2 border-textPrimary">Sign up</h2>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="input-field"
          required
        />

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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="input-field"
          required
        />

        {err.isErr && <p className="text-red-500">{err.msg}</p>}

        <button
          type="submit"
          className="btn-accent-one mt-2 border-2 border-textPrimary"
        >
          Sign Up
        </button>
        <p>
          Already have an account ?
          <Link
            href="/login"
            className="text-blue-600 decoration-blue-600 underline"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Page;
