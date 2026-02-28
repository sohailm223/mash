import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: String,
        password: String,
        image: String,
        history: String,
        currentUser: String
    },
    { timestamps: true }
);
export default mongoose.models.User ||
  mongoose.model("User", UserSchema);