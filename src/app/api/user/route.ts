import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/model/user';
import { AxiosError } from 'axios';

//To add new User to the database
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, name, image } = await req.json();
    const existUser = await User.findOne({ email });
    if (existUser)
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 200 }
      );
    const newUser = new User({ email, name, image });
    await newUser.save();
    return NextResponse.json(
      { message: 'User added successfully' },
      { status: 200 }
    );
  } catch (err:unknown) {
    const error = err as AxiosError;
    return NextResponse.json({ error:error.message}, { status: 200 });
  }
}
