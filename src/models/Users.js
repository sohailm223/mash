import mongoose from "mongoose";

// a user now has credentials and an optional questionnaire
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
    // the hashed password (do not store raw passwords!)
    passwordHash: {
      type: String,
      required: true,
    },

    // boolean flag indicating whether the onboarding questionnaire has been completed
    profileComplete: {
      type: Boolean,
      default: false,
    },

    // store the answers to the 10 questions, keyed by id or index
    questionnaire: [
      {
        questionId: String,
        answer: String,
      },
    ],

    likedFoods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
    dislikedFoods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
