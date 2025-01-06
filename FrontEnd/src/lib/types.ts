export type UserType = {
  user_id: number;
  fname: string;
  email: string;
  fpassword: string;
  pic: string | null;
  bio: string;
};

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

export type CommentType = {
  pic: string | null;
  fname: string;
  user_id: number;
  fcontent: string;
  created_at: Date;
};
