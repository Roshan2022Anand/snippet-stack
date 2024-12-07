import { Types, Document } from 'mongoose';
import { z } from 'zod';
import { PostFormValidation } from '@/lib/validations';

export type PostType = Document &
  z.infer<typeof PostFormValidation> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type PopulatedPostType = Omit<PostType, 'author'> & { author: UserType };

export type UserType = Document & {
  name: string;
  email: string;
  image: string;
  bio: string;
  posts: Types.ObjectId;
};

export type PopulatedUserData = Omit<UserType, 'posts'> & { posts: PostType[] };
