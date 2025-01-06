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
        <section className="heading">
          <h1> Find the Programming insights here</h1>
          <SearchBar />
        </section>
      </header>
      <PostContainerSkeliton />
    </>
  );
};

export default loading;
