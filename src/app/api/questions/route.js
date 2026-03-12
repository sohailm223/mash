import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Ensure this is the path to your DB connection file
import User from "@/models/Users"; // Ensure this is the correct path to your User model

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the incoming request body
    const body = await req.json();

    const {
      userId,
      foodPreference,
      spicePreference,
      allergies,
      healthySuggestions,
      weightGoal,
      preferences,
      mood,
      weather,
    } = body;

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
    }

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          foodPreference: foodPreference || existingUser.foodPreference,
          spicePreference: spicePreference || existingUser.spicePreference,
          allergies: allergies || existingUser.allergies,
          healthySuggestions: healthySuggestions || existingUser.healthySuggestions,
          weightGoal: weightGoal || existingUser.weightGoal,
          preferences: preferences || existingUser.preferences,
        },
        $addToSet: {
          mood: { $each: mood || [] },
          weather: { $each: weather || [] },
        },
      },
      { new: true } // Return the updated document
    );

    // Return the updated user data
    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}