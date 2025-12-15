// server/routes/post.js

import express from "express";
import {
  createPost,
  getPublicPosts,
  likePost,
  commentPost,
  sharePost,
} from "../controller/post.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// multer setup - store files in /uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per file
});

router.post("/create", auth, upload.array("media", 5), createPost); // up to 5 files
router.get("/public", getPublicPosts);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentPost);
router.post("/:id/share", auth, sharePost);

export default router;
