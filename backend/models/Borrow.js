import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  issueDate: Date,
  dueDate: Date,
  status: { type: String, default: "issued" },
});

export default mongoose.model("Borrow", borrowSchema);
