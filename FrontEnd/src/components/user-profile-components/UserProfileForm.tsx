'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import { UserType } from '@/lib/types';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfileForm = ({ userData }: { userData: UserType }) => {
  const { name, bio, image } = userData;
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);

  const [editState, setEditState] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUserData = {
      name: nameRef.current?.value,
      bio: bioRef.current?.value,
    };
    
      const res = await axios.put("http://localhost:5000/api/user", {
        updatedUserData,
        userID: userData.user_id,
      });
      if(res.data.message)toast.success(res.data.message);
      else if(res.data.error)toast.error(res.data.error);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row-reverse  items-center justify-around w-full relative"
    >
      <section className="absolute top-1 right-1 z-10">
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
          alt={`${name}`}
          width={200}
          height={200}
          className="rounded-full border-4 border-accentPrimary"
        />
      </section>
      <section className="flex flex-col w-2/3">
        <label>Name</label>
        <fieldset>
          <input
            type="text"
            ref={nameRef}
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
            ref={bioRef}
            disabled={!editState}
            className="bg-transparent grow"
          />
        </fieldset>
      </section>
    </form>
  );
};
export default UserProfileForm;
