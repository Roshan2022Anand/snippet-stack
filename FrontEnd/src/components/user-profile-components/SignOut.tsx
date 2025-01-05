'use client';
import { hapiApi } from '@/lib/client-utils';
import { deleteImage } from '@/lib/supabaseStorage';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

const SignOut = () => {
  const router = useRouter();

  //function to sign out user
  const handleSignOut = async () => {
    const res = await hapiApi.get('api/logout');
    if (res.data.message) {
      toast.success(res.data.message);
      router.push('/');
    }
  };

  //function to delete the user and sign out
  const handleDelete = async () => {
    try {
      const res = await hapiApi.delete('api/user');
      const { imgArr } = res.data;
      await deleteImage(imgArr);
      toast.success(res.data.message);
      // await
      router.push('/');
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-evenly grow">
      <button
        className="bg-red-500 w-2/3 rounded-md font-bold"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        className="bg-yellow-500 font-bold w-2/3 rounded-md"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
