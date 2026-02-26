import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   mealTiming: [String],
    dietType: [String],
    healthGoals: [String],
    foodStyle: String,
    cuisine: [String],
    cookTime: Number,
    price: Number,
    mood: [String],
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
    calories: Number,
  },
  { timestamps: true }
);

// IMPORTANT: prevent overwrite error
export default mongoose.models.Food ||
  mongoose.model("Food", FoodSchema);