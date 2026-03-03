import connectDB from "@/lib/db";
import User from "@/models/Users";
import Food from "@/models/Food"; // ensure schema is registered for populate
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const authUser = await getUserFromCookie(req);
    if (!authUser) {
      return Response.json({ success: false, message: "not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { foodId, action } = body;

    if (!foodId || !action) {
      return Response.json(
        { success: false, message: "foodId and action are required" },
        { status: 400 }
      );
    }

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

    const user = await User.findByIdAndUpdate(authUser._id, update, {
      new: true,
    }).lean();

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const authUser = await getUserFromCookie(req);
    if (!authUser) {
      return Response.json({ success: false, message: "not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { answers, skip } = body;

    // basic validation
    let update = {};
    if (skip) {
      update.profileComplete = false; // user skipped
    } else if (answers) {
      update.questionnaire = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      update.profileComplete = true;
    } else {
      return Response.json({ success: false, message: "nothing to update" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(authUser._id, update, {
      new: true,
    }).lean();

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const userFromCookie = await getUserFromCookie(req);
    if (!userFromCookie) {
      // not authenticated; return 200 so front-end doesn't treat it as failure
      return Response.json({ success: false, message: "not authenticated" }, { status: 200 });
    }
    const user = await User.findById(userFromCookie._id)
      .populate("likedFoods")
      .populate("dislikedFoods")
      .lean();
    return Response.json({ success: true, data: user });
  } catch (error) {
    // log on server console for debugging
    console.error("/api/users GET error", error);
    // still return 200 with success:false so network tab stops complaining
    return Response.json({ success: false, message: error.message }, { status: 200 });
  }
}
