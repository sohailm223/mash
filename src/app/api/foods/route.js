import connectDB from "@/lib/db";
import Food from "@/models/Food";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // remove price from payload if present – field has been deprecated
    if (body.price !== undefined) {
      delete body.price;
    }

    if (!body.name || !body.image || !body.cookingMode) {
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

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    let query = {};

    const name = searchParams.get("name");
    if (name) {
      query.name = new RegExp(name, "i");
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
      query.cuisine = new RegExp(cuisine, "i");
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

    const cookTime = searchParams.getAll("cookTime");
    if (cookTime.length > 0) {
      const timeRanges = cookTime
        .map((range) => {
          if (range === "0-15 min") {
            return { cookTime: { $gte: 0, $lte: 15 } };
          }
          if (range === "15-30 min") {
            return { cookTime: { $gte: 15, $lte: 30 } };
          }
          if (range === "30-60 min") {
            return { cookTime: { $gte: 30, $lte: 60 } };
          }
          if (range === "60+ min") {
            return { cookTime: { $gte: 60 } };
          }
          return null;
        })
        .filter(Boolean); // remove nulls

      if (timeRanges.length > 0) {
        // Add an $or condition for the selected time ranges
        // This will be combined with other filters using an implicit AND
        query.$or = timeRanges;
      }
    }

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
