import express from "express";
import { Login, Signup, getallusers, updateprofile, forgotPassword } from "../controller/auth.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forgot-password", forgotPassword); 
router.get("/getalluser", getallusers);
router.patch("/update/:id",auth, updateprofile);

export default router;