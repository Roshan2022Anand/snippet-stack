import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/model/user';
import { AxiosError } from 'axios';
import { PopulatedUserData } from '@/lib/types';
import user from '@/model/user';

//To add new User to the database
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, name, image } = await req.json();
    const existUser = await User.findOne({ email });
    if (existUser)
      return NextResponse.json({ id: existUser._id }, { status: 200 });
    const newUser: PopulatedUserData = new User({ email, name, image });
    await newUser.save();
    return NextResponse.json({ id: newUser._id }, { status: 200 });
  } catch (err: unknown) {
    const error = err as AxiosError;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//To get the user details
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get('userID');
    const currUser = await User.findById(userID).populate('posts');
    return NextResponse.json({ currUser }, { status: 200 });
  } catch (err: unknown) {
    const error = err as AxiosError;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//To update the user details
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { updatedUserData, userID } = await req.json();
    const updatedUser = await user.findOneAndUpdate(
      { _id: userID },
      updatedUserData,
      { new: true }
    );
    if (updatedUser) return NextResponse.json({ error:false }, { status: 200 });
    else return NextResponse.json({ error: true }, { status: 200 });
  } catch (err: unknown) {
    const error = err as AxiosError;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
