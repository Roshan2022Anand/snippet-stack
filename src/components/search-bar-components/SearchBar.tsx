import React from 'react';
import Form from 'next/form';
import ClearBtn from './ClearBtn';
import { FaSearch } from 'react-icons/fa';

const SearchBar = async ({ query }: { query?: string }) => {
  return (
    <Form
      action="/public"
      className="search-form mx-auto flex w-fit items-center justify-center gap-5 rounded-lg border-2 border-accentPrimary bg-bgPrimary px-2 py-1"
    >
      <input
        type="text"
        name="query"
        className="bg-transparent text-accentPrimary focus:outline-none"
        placeholder="Search..."
        defaultValue={query}
      />
      {query && <ClearBtn />}`
      <button type="submit" className="btn-accent-one">
        <FaSearch/>
      </button>
    </Form>
  );
};
export default SearchBar;
