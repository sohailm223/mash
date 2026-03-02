import connectDB from "@/lib/db";
import User from "@/models/Users";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { foodId, action } = body;

    if (!foodId || !action) {
      return Response.json(
        { success: false, message: "foodId and action are required" },
        { status: 400 }
      );
    }

    // simple single-user model (no authentication)
    const update = {};
    if (action === "like") {
      update.$addToSet = { likedFoods: foodId };
    } else if (action === "dislike") {
      update.$addToSet = { dislikedFoods: foodId };
    } else {
      return Response.json(
        { success: false, message: "invalid action" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    }).lean();

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await User.findOne({})
      .populate("likedFoods")
      .populate("dislikedFoods")
      .lean();
    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
