'use server';
import axios, { AxiosResponse } from 'axios';
import { Session } from 'next-auth';

type postFormType = {
  title: string;
  description: string;
  image: string;
  category: string;
  about: string;
};

export const createPostApiReq = async (
  postForm: postFormType,
  session: Session
) => {
  try {
    const res: AxiosResponse<{ status: number }> = await axios.post(
      `${process.env.BASE_URL}/api/post`,
      { postForm, email: session.user?.email }
    );
    if (res.status === 200) return { message: 'Post Created Succesfully' };
    else return { error: 'Error while creating Post, try again later' };
  } catch (err) {
    console.log(err);
    return { error: 'Something went wrong, Please try again later' };
  }
};
