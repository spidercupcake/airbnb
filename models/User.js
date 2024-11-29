import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    favorites: { type: [String], default: [] }, // Array of listing IDs
  },
  { timestamps: true }
);

// Explicitly set the collection name to 'users'
export default mongoose.models.User || mongoose.model("User", UserSchema, "users");
