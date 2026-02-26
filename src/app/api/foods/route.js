import connectDB from "@/lib/db";
import Food from "@/models/Food";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Incoming body:", body);

    // Safety: agar order-online hai to recipe hata do
    if (body.cookingMode === "order-online") {
      delete body.recipe;
    }

    // Safety: agar cook-yourself hai to orderInfo hata do
    if (body.cookingMode === "cook-yourself") {
      delete body.orderInfo;
    }

   const food = new Food(body);
    const savedFood = await food.save();
    console.log("Saved food:", savedFood);

    return Response.json(
      {
        success: true,
        data: savedFood,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

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

    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
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