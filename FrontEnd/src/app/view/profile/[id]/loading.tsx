import {
  NavSkeliton,
  PostContainerSkeliton,
  UserProfileSkeliton,
} from '@/components/utility-components/Skelitons';
import React from 'react';

const loading = () => {
  return (
    <>
      <header className="flex w-full flex-col">
        <NavSkeliton />
        <section className="mb-5 flex w-full flex-col items-center justify-center gap-2 bg-bgSecondary py-2">
          <h1>Your Profile</h1>
          <UserProfileSkeliton />
        </section>
      </header>
      <PostContainerSkeliton />
    </>
  );
};

export default loading;
