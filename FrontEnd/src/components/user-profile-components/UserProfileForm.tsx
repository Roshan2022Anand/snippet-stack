'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FaPen, FaUser, FaPlus } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import { UserType } from '@/lib/types';
import { toast } from 'react-toastify';
import { fileToImageUrl, hapiApi } from '@/lib/client-utils';
import { uploadImage } from '@/lib/supabaseStorage';
import axios from 'axios';

const UserProfileForm = ({ session }: { session: UserType }) => {
  const { fname, bio, pic } = session;
  //refs
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  //states
  const [editState, setEditState] = useState<boolean>(false);
  const [userProfile, setuserProfile] = useState<string | null>(pic);

  //function to update user profile
  const handleSubmit = async () => {
    const pic = await uploadImage(imageRef?.current?.files?.[0] as File);

    const updatedUserData = {
      name: nameRef.current?.value,
      bio: bioRef.current?.value,
      pic,
    };

    //calling API then showing the toast message
    try {
      const res = await hapiApi.put('/api/user', updatedUserData);
      toast.success(res.data.message);
      setEditState(false);
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row-reverse  items-center justify-around w-2/3 relative"
    >
      <section className="absolute top-1 right-1 z-10">
        {editState ? (
          <button
            type="button"
            className="btn-accent-one"
            onClick={handleSubmit}
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
      <section className="relative w-[20%] h-[85%] flex justify-center items-center border-4 border-accentPrimary rounded-full ">
        {userProfile && userProfile !== 'null' ? (
          <Image
            src={`${userProfile}`}
            alt={`${fname}`}
            width={200}
            height={200}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <FaUser className="size-2/3 text-accentPrimary" />
        )}
        {editState && (
          <div className="size-[30px] absolute right-0 bottom-0">
            <FaPlus className="size-full bg-accentPrimary rounded-full p-1 text-bgPrimary" />
            <input
              type="file"
              className="size-full absolute top-0 left-0 opacity-0"
              ref={imageRef}
              onChange={(e) => {
                const url = fileToImageUrl(e);
                setuserProfile(url);
              }}
            />
          </div>
        )}
      </section>
      <section className="flex flex-col w-2/3">
        <label>Name</label>
        <fieldset>
          <input
            type="text"
            name="name"
            id="name"
            ref={nameRef}
            defaultValue={fname}
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
