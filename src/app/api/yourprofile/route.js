import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/Users";

export async function PUT(req) {
  try {

    await connectDB();

    // formData read
    const formData = await req.formData();

    const userId = formData.get("userId");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const gender = formData.get("gender");
    const image = formData.get("image");

    // check userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID" },
        { status: 400 }
      );
    }

    // image handling (basic)
    let imageUrl = "";

    if (image && typeof image !== "string") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // temporary base64 image save
      imageUrl = `data:${image.type};base64,${buffer.toString("base64")}`;
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        gender,
        ...(imageUrl && { image: imageUrl })
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {

    console.log("PROFILE UPDATE ERROR:", error);

    return NextResponse.json({
      success: false,
      message: "Server Error",
    });

  }
}