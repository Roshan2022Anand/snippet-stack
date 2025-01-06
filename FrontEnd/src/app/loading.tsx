import SearchBar from '@/components/search-bar-components/SearchBar';
import {
  NavSkeliton,
  PostContainerSkeliton,
} from '@/components/utility-components/Skelitons';
import React from 'react';

const loading = () => {
  return (
    <>
      <header className="w-full">
        <NavSkeliton />
        <section className="mb-5 flex flex-col items-center justify-center gap-3 bg-bgSecondary py-3">
          <h1> Find the Programming insights here</h1>
          <SearchBar />
        </section>
      </header>
      <PostContainerSkeliton />
    </>
  );
};

export default loading;
