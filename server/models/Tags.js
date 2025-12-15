import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  questions: Number,
  askedToday: Number,
  askedWeek: Number,
});

export default mongoose.model("Tag", tagSchema);

