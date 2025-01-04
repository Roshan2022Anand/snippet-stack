export type PostType = {
  post_id: number;
  title: string;
  description: string;
  image: string;
  about: string;
  category: string;
  views: number;
  created_at: Date;
};

export type UserType = {
  user_id: number;
  fname: string;
  email: string;
  fpassword: string;
  pic: string | null;
  bio: string;
};

export type JoinPostUserType = PostType & UserType;

export type PostInfoType = {
  user_id: number;
  fname: string;
  pic: string | null;
  post_id: number;
  title: string;
  description: string;
  about: string;
  image: string;
  category: string;
  views: number;
  created_at: Date;
  up_votes: number;
  down_votes: number;
  voted: number;
  comments: number;
};
