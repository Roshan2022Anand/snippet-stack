
export type PostType = {
  post_id: number;
  title: string;
  description: string;
  image: string;
  about: string;
  category: string;
  pviews: number;
  upvote: number;
  downvote: number;
  created_at: Date;
  user_id: number;
};

export type UserType = {
  user_id: number;
  fname: string;
  email: string;
  pic: string;
  bio: string;
};

export type JoinPostUserType = PostType & UserType;
