import mongoose from "mongoose";
import {
  CATEGORY_OPTIONS,
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  OCCASION_OPTIONS,
} from "@/lib/constants";

const FoodSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: CATEGORY_OPTIONS.map((c) => c.value),
    },
    items: [String],

    // 1 Meal Timing
    mealTiming: {
      type: [String],
      enum: MEAL_TIMING_OPTIONS,
    },

    // 2 Diet Type
    dietType: {
      type: [String],
      enum: DIET_TYPE_OPTIONS,
    },

    // 3 Health Goals
    healthGoals: {
      type: [String],
      enum: HEALTH_GOALS_OPTIONS,
    },

    // 4 Food Style
    foodStyle: {
      type: String,
      enum: [
        "fast-food",
        "home-style",
        "street-food",
        "restaurant-style",
        "traditional",
        "modern-fusion",
      ],
    },

    // 5 Cuisine
    cuisine: {
      type: [String],
      enum: CUISINE_OPTIONS,
    },

    // 8 Mood Based
    mood: {
      type: [String],
      enum: MOOD_OPTIONS,
    },

    // 9 Ingredient Based

    // 1. Cooking Mode
    cookingMode: {
      type: String,
      enum: ["cook-yourself", "order-online"],
    },

    recipe: {
      ingredients: [String],
      steps: [String],
    },

    nutrition: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },

    orderInfo: {
      swiggyLink: String,
      zomatoLink: String,
      deliveryTime: Number,
    },

    // 2. Occasion
    occasion: {
      type: [String],
      enum: OCCASION_OPTIONS,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Food ||
  mongoose.model("Food", FoodSchema);