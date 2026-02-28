import connectDB from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();

    const user = await User.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: "after", // ✅ replaces `new: true`
        runValidators: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  try {
    await connectDB();

   
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User deleted",
      user,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}