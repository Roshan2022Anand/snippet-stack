import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/model/post';
import { AxiosError } from 'axios';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const lastDate: string | null = searchParams.get('lastDate');
    let currPosts;
    if (lastDate) {
      const lastDateObj = new Date(lastDate);
      currPosts = await Post.find({ createdAt: { $lt: lastDateObj } })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('author');
    } else
      currPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('author');
    return NextResponse.json(
      { message: 'All posts fetched successfully', currPosts },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err as AxiosError;
    return NextResponse.json(
      { error: error},
      { status: 200 }
    );
  }
}