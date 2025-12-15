import express from "express";
import Tags from "../models/Tags.js";

const router = express.Router();

// GET /tags → fetch all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tags.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tags" });
  }
});

export default router;
