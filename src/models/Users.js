import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
