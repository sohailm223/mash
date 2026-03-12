import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/Users";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {  

    await connectDB();

    const body = await req.json();

    const { email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password Updated Successfully ✅",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }
}