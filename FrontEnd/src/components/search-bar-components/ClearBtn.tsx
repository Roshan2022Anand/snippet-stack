'use client';
import React from 'react';
import Link from 'next/link';
import { ImCross } from 'react-icons/im';

const ClearBtn = () => {
  const clearSearch = () => {
    const form = document.querySelector('.search-form') as HTMLFormElement;
    if (form) form.reset();
  };
  return (
    <button onClick={clearSearch} className="btn-accent-one">
      <Link href="/">
        <ImCross />
      </Link>
    </button>
  );
};
export default ClearBtn;
