import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/Users';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, answers } = await req.json();

    if (!userId || !answers) {
      return NextResponse.json({ message: "Missing userId or answers." }, { status: 400 });
    }

    console.log('Received preferences for userId:', userId);
    console.log('Answers:', answers);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Save the answers dynamically into the 'preferences' field
    user.preferences = answers;

    await user.save();

    return NextResponse.json({ message: "Preferences Saved Successfully ✅" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred while saving preferences." }, { status: 500 });
  }
}