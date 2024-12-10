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
    <button onClick={clearSearch} className="normal-btn">
      <Link href="/public">
        <ImCross className="rotate-45" />
      </Link>
    </button>
  );
};
export default ClearBtn;
