import mongoose from "mongoose";

// Agar already model exist karta hai, reuse karo
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
    },

    phone: {
      type: String,
    },

    gender: {
      type: String,
    },

    currentUser: {
      type: String,
    },

    history: {
      type: [String],
      default: [],
    },

    foodPreference: {
      type: [String],
      default: [],
    },

    spicePreference: {
      type: [String],
      default: [],
    },

    allergies: {
      type: [String],
      default: [],
    },

    healthySuggestions: {
      type: [String],
      default: [],
    },

    weightGoal: {
      type: [String],
      default: [],
    },

    preferences: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Export single model
export default mongoose.models.User || mongoose.model("User", UserSchema);