import { z } from 'zod';
import { PostFormValidation } from '@/lib/validations';

export type PostType = {
  post_id: number;
  title: string;
  post_img: string;
  description: string;
  about: string;
  category: string;
  post_views: number;
  upvote: number;
  downvote: number;
  user_id: number;
};

export type UserType = {
  user_id: number;
  name: string;
  email: string;
  image: string;
  bio: string;
};
