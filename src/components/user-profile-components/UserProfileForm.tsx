'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaPen } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import { UserType } from '@/lib/types';

const UserProfileForm = ({ userData }: { userData: UserType}) => {
  const { name, bio, image } = userData;

  const [nameState, setNameState] = useState<boolean>(false);
  const [bioState, setBioState] = useState<boolean>(false);

  return (
    <section className="sm:flex flex-row-reverse items-center justify-around w-full">
      <section className="relative">
        <Image
          src={`${image}`}
          alt={name}
          width={200}
          height={200}
          className="rounded-full border-4 border-accentPrimary"
        />
        <button className="btn-accent-one absolute top-2/3 right-0">
          <FaPen />
        </button>
      </section>
      <section className="flex flex-col w-2/3">
        <label>Name</label>
        <fieldset>
          <input
            type="text"
            defaultValue={name}
            disabled={!nameState}
            className="bg-transparent grow"
          />
          {nameState ? (
            <button
              className="btn-accent-one"
              onClick={() => setNameState(!nameState)}
            >
              <TiTick />
            </button>
          ) : (
            <button
              className="btn-accent-one"
              onClick={() => setNameState(!nameState)}
            >
              <FaPen />
            </button>
          )}
        </fieldset>
        <label>Bio</label>
        <fieldset>
          <input
            type="text"
            defaultValue={bio}
            disabled={!bioState}
            className="bg-transparent grow"
          />
          {bioState ? (
            <button
              className="btn-accent-one"
              onClick={() => setBioState(!bioState)}
            >
              <TiTick />
            </button>
          ) : (
            <button
              className="btn-accent-one"
              onClick={() => setBioState(!bioState)}
            >
              <FaPen />
            </button>
          )}
        </fieldset>
      </section>
    </section>
  );
};
export default UserProfileForm;
