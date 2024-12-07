import { z } from 'zod';

export const PostFormValidation = z.object({
  title: z
    .string()
    .min(5, 'Tile Should be more than 5 letters')
    .max(50, 'Title should be less than 50 letters'),
  description: z
    .string()
    .min(10, 'Description should be more than 10 letters')
    .max(200, 'Description should be less than 200 letters'),
  image: z.string(),
  category: z.string(),
  about: z.string().min(20, 'Details should be more that 20 letters'),
  author:z.string().uuid().optional(),
  views: z.number().optional(),
  upVote: z.number().optional(),
  downVote: z.number().optional(),
});
