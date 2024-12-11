'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import { UserType } from '@/lib/types';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfileForm = ({ userData }: { userData: UserType }) => {
  const { name, bio, image } = userData;

  const [editState, setEditState] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUserData = {
      name: formData.get('name'),
      bio: formData.get('bio'),
      // image: formData.get('image'),
    };

    const res = await axios.put('/api/user', {
      updatedUserData,
      userID: userData._id,
    });
    if (!res.data.error) toast.success('Profile Updated Successfully');
    else toast.error('Something went wrong while updating the profile');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row-reverse  items-center justify-around w-full relative"
    >
      <section className="absolute top-1 right-1">
        {editState ? (
          <button
            type="button"
            className="btn-accent-one"
            onClick={() => setEditState(!editState)}
          >
            <TiTick />
          </button>
        ) : (
          <button
            type="submit"
            className="btn-accent-one"
            onClick={() => setEditState(!editState)}
          >
            <FaPen />
          </button>
        )}
      </section>
      <section className="relative w-fit">
        <Image
          src={`${image}`}
          alt={name}
          width={200}
          height={200}
          className="rounded-full border-4 border-accentPrimary"
        />
        {/*<input*/}
        {/*  className="w-2/3 absolute top-1/2 left-1/2 bg-accentPrimary -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-bgPrimary"*/}
        {/*  type="file"*/}
        {/*  style={{*/}
        {/*    display: editState ? 'block' : 'none',*/}
        {/*  }}*/}
        {/*/>*/}
      </section>
      <section className="flex flex-col w-2/3">
        <label>Name</label>
        <fieldset>
          <input
            type="text"
            defaultValue={name}
            disabled={!editState}
            className="bg-transparent grow"
          />
        </fieldset>
        <label>Bio</label>
        <fieldset>
          <input
            type="text"
            defaultValue={bio}
            disabled={!editState}
            className="bg-transparent grow"
          />
        </fieldset>
      </section>
    </form>
  );
};
export default UserProfileForm;
