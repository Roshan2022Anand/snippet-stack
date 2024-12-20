import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/model/post';
import User from '@/model/user';
import { AxiosError } from 'axios';

//to create a new post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { postForm, email } = await req.json();
    const currUser = await User.findOne({ email });
    postForm['author'] = currUser._id;
    const newPost = await Post.create(postForm);
    await newPost.save();
    currUser.posts.push(newPost._id);
    await currUser.save();
    return NextResponse.json(
      { message: 'Post created successfully' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err as AxiosError
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//to get post
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const postId: string | null = searchParams.get('postId');
    const postData = await Post.findById(postId).populate('author');
    return NextResponse.json({ postData }, { status: 200 });
  } catch (err: unknown) {
    const error = err as AxiosError;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
