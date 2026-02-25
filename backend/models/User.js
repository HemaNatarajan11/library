import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "librarian"] },
});

export default mongoose.model("User", userSchema);
