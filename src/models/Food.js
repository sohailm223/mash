import mongoose from "mongoose";
import {
  CATEGORY_OPTIONS,
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
} from "@/lib/constants";

const FoodSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: String,

    // SEARCH KEYWORDS
    searchKeywords: [String],

    // CATEGORY
    category: {
      type: String,
      enum: CATEGORY_OPTIONS.map((c) => c.value),
    },

    // MEAL TIMING
    mealTiming: {
      type: [String],
      enum: MEAL_TIMING_OPTIONS,
    },

    // DIET TYPE (Kept for robust filtering alongside Category)
    dietType: {
      type: [String],
      enum: DIET_TYPE_OPTIONS,
    },

    // HEALTH GOALS
    healthGoals: {
      type: [String],
      enum: HEALTH_GOALS_OPTIONS,
    },

    // CUISINE
    cuisine: {
      type: [String],
      enum: CUISINE_OPTIONS,
    },

    // INGREDIENT SEARCH
    ingredients: [String],

    // FOOD STYLE
    foodStyle: {
      type: [String],
      enum: ["fast-food", "street-food", "home-style", "restaurant-style"],
    },

    // MOOD
    mood: {
      type: [String],
      enum: MOOD_OPTIONS,
    },

    // WEATHER
    weather: {
      type: [String],
      enum: WEATHER_OPTIONS,
    },

    // NUTRITION
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },

    // ORDER INFO
    orderInfo: {
      swiggyLink: String,
      zomatoLink: String,
      deliveryTime: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Food || mongoose.model("Food", FoodSchema);
