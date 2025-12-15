import mongoose from "mongoose";
const userschema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, sparse: true }, 
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinDate: { type: Date, default: Date.now },
    lastResetRequest: { type: Date, default: null },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});
export default mongoose.model("user", userschema);