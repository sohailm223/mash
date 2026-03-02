import connectDB from "@/lib/db";
import Food from "@/models/Food";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received POST body:", body);

    if (!body.name || !body.image) {
      return Response.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    if (body.cookingMode === "order-online") {
      body.recipe = undefined;
    }

    if (body.cookingMode === "cook-yourself") {
      body.orderInfo = undefined;
    }

    const food = await Food.create(body);

    return Response.json(
      { success: true, data: food },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    let query = {};

    const name = searchParams.get("name");
    if (name) {
      query.name = new RegExp(escapeRegExp(name), "i");
    }

    const dietType = searchParams.getAll("dietType");
    if (dietType.length > 0) {
      query.dietType = { $in: dietType };
    }

    const healthGoals = searchParams.getAll("healthGoals");
    if (healthGoals.length > 0) {
      query.healthGoals = { $in: healthGoals };
    }

    const cuisine = searchParams.get("cuisine");
    if (cuisine) {
      query.cuisine = new RegExp(escapeRegExp(cuisine), "i");
    }

    const mealTiming = searchParams.getAll("mealTiming");
    if (mealTiming.length > 0) {
      query.mealTiming = { $in: mealTiming };
    }

    const mood = searchParams.getAll("mood");
    if (mood.length > 0) {
      query.mood = { $in: mood };
    }

    // filter by ingredients (must contain all selected)
    const ingredients = searchParams.getAll("ingredients");
    if (ingredients.length > 0) {
      query.ingredients = { $all: ingredients };
    }

    // filter by restricted ingredients (exclude foods that contain any of these)
    const restrictedIngredients = searchParams.getAll("restrictedIngredients");
    if (restrictedIngredients.length > 0) {
      query.restrictedIngredients = { $nin: restrictedIngredients };
    }

    const cookingMode = searchParams.get("cookingMode");
    if (cookingMode) {
      query.cookingMode = cookingMode;
    }

    const cookTimeRangesMap = {
      "0-15 min": { $gte: 0, $lte: 15 },
      "15-30 min": { $gte: 15, $lte: 30 },
      "30-60 min": { $gte: 30, $lte: 60 },
      "60+ min": { $gte: 60 },
    };

    const cookTime = searchParams.getAll("cookTime");
    if (cookTime.length > 0) {
      const timeRanges = cookTime
        .map((range) =>
          cookTimeRangesMap[range]
            ? { cookTime: cookTimeRangesMap[range] }
            : null
        )
        .filter(Boolean);

      if (timeRanges.length > 0) {
        query.$or = timeRanges;
      }
    }

    // if caller asked for a random result, return a single random document
    if (searchParams.get("random")) {
      const excludeIds = searchParams.getAll("exclude");
      const validExcludeObjectIds = excludeIds
        .map((id) => {
          if (mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id);
          }
          return null;
        })
        .filter(Boolean);

      if (validExcludeObjectIds.length > 0) {
        query._id = { $nin: validExcludeObjectIds };
      }
      const randomDocs = await Food.aggregate([
        { $match: query },
        { $sample: { size: 1 } },
      ]);
      const item = randomDocs[0] || null;
      return Response.json({ success: true, data: item });
    }

    // otherwise normal list response
    // exclude price field from response in case legacy documents still have it
    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .select("-price")
      .lean();

    return Response.json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
