import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: String, // vegetarian / non-vegetarian
    spiceLevel: String,
    calories: Number,
    isHealthy: Boolean,
    suitableForWeightGoal: [String],
    allergens: [String],
    price: Number,
    cookingTime: Number,
    availableAt: String,
  },
  { timestamps: true }
);

// IMPORTANT: prevent overwrite error
export default mongoose.models.Food ||
  mongoose.model("Food", FoodSchema);