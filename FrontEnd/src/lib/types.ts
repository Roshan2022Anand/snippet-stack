export type PostType = {
  post_id: number;
  title: string;
  description: string;
  image: string;
  about: string;
  category: string;
  created_at: Date;
  user_id: number;
};

export type UserType = {
  user_id: number;
  fname: string;
  email: string;
  pic: string | null;
  bio: string;
};

export type VotesType = {
  user_id: number;
  post_id: number;
  vote: number;
};

export type CommentType = {
  comment_id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: Date;
};

export type JoinPostUserType = PostType & UserType;
