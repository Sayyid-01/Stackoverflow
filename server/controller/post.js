// server/controller/post.js
import Post from "../models/Post.js";
import User from "../models/auth.js";
import mongoose from "mongoose";

// Helper: calculate posts allowed for a user based on friend count
const postsAllowedFor = (friendCount) => {
  if (friendCount === 0) return 0;
  if (friendCount === 1) return 1;
  if (friendCount >= 2 && friendCount <= 10) return friendCount;
  // > 10 => unlimited
  return Infinity;
};

// Create Post (multipart/form-data), expects req.user (authenticated)
export const createPost = async (req, res) => {
  try {
    const userId = req.userId; // assume auth middleware sets this
    const text = req.body.text || "";

    // get user friends count
    const user = await User.findById(userId).select("friends");
    const friendCount = (user && user.friends) ? user.friends.length : 0;

    const allowed = postsAllowedFor(friendCount);
    if (allowed === 0) {
      return res.status(403).json({ message: "You must have at least 1 friend to post on the public page." });
    }

    if (allowed !== Infinity) {
      // count posts in last 24 hours
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = await Post.countDocuments({
        author: userId,
        createdAt: { $gte: since },
      });

      if (recentCount >= allowed) {
        return res.status(429).json({
          message: `Daily post limit reached. Allowed per day: ${allowed}.`,
        });
      }
    }

    // handle uploaded files (req.files) - multer used in route
    const media = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        // store local URL path (served by express.static)
        const url = `/uploads/${f.filename}`;
        const isVideo = f.mimetype.startsWith("video/");
        media.push({ url, type: isVideo ? "video" : "image" });
      }
    }

    const post = new Post({
      author: userId,
      text,
      media,
      isPublic: true,
    });

    await post.save();
    await post.populate("author", "name email");

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get public feed (paginated)
export const getPublicPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name");

    res.json({ posts, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Like / Unlike
export const likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid post id" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const idx = post.likes.findIndex((id) => id.toString() === userId);
    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment
export const commentPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const { text } = req.body;
    if (!text || text.trim() === "") return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author: userId, text });
    await post.save();
    await post.populate("comments.author", "name");
    res.json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Share (increase share count)
export const sharePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.shares = (post.shares || 0) + 1;
    await post.save();
    res.json({ shares: post.shares });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
