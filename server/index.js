import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import path from "path"
import postRoutes from "./routes/post.js"
import userroutes from "./routes/auth.js"
import questionroute from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import tagRoutes from "./routes/tagRoutes.js"

// Initialize app
const app = express();

// Load environment variables
dotenv.config();    

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));


// Test Route
app.get("/", (req, res) => {
    res.send("Stackoverflow clone is running perfect ✅");
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/post", postRoutes);

// API Routes
app.use("/user", userroutes);
app.use("/question", questionroute);
app.use("/answer", answerroutes);
app.use("/tags", tagRoutes);



// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.MONGODB_URL
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

// Export app for testing
export default app