import React from 'react';

const page = async({ params }: { params: Promise<{ id: string }> }) => {
  const userID = (await params).id;
  return <div>{userID}</div>;
};

export default page;
