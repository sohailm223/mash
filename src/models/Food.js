import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // store image URL
      required: true,
    },

    description: {
      type: String,
    },

    mealTiming: [String],
    dietType: [String],
    healthGoals: [String],
    foodStyle: [String],
    cuisine: [String],

    cookTime: {
      type: Number,
      required: true,
    },

    mood: [String],
    occasion: [String],

    ingredients: [String],
    restrictedIngredients: [String],

    cookingMode: {
      type: String,
      enum: ["cook-yourself", "order-online"],
      required: true,
    },

    recipe: {
      ingredients: [String],
      steps: [String],
    },

    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },

    orderInfo: {
      swiggyLink: String,
      zomatoLink: String,
      deliveryTime: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Food ||
  mongoose.model("Food", FoodSchema);