import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";


export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exisitinguser = await user.findOne({ email });
        if (exisitinguser) {
            return res.status(404).json({ message: "User already exist" });
        }

        const hashpassword = await bcrypt.hash(password, 12);
        const newuser = await user.create({
            name,
            email,
            password: hashpassword,
 
        });

        const token = jwt.sign({ email: newuser.email, id: newuser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ data: newuser, token });
    } catch (error) {
        res.status(500).json("something went wrong..");
        return;
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const exisitinguser = await user.findOne({ email });
        if (!exisitinguser) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const ispasswordcrct = await bcrypt.compare(password, exisitinguser.password);
        if (!ispasswordcrct) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ email: exisitinguser.email, id: exisitinguser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ data: exisitinguser, token });
    } catch (error) {
        res.status(500).json("something went wrong..");
        return;
    }
}


// get all users
export const getallusers = async (req, res) => {
    try {
        const alluser = await user.find();
        res.status(200).json({ data: alluser });
    } catch (error) {
        res.status(500).json("something went wrong..");
        return;
    }
}

// update profile
export const updateprofile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body.editForm;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "User unavailable" });
    }
    try {
        const updateprofile = await user.findByIdAndUpdate(
            _id,
            { $set: { name: name, about: about, tags: tags } },
            { new: true }
        );
        res.status(200).json({ data: updateprofile });
    } catch (error) {
        console.log(error);
        res.status(500).json("something went wrong..");
        return;
    }
}


// Helper to generate random password (only uppercase + lowercase)
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};


export const forgotPassword = async (req, res) => {
  const { contact, method } = req.body;
  if (!contact || !['email', 'phone'].includes(method)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Find user
    const existingUser = await user.findOne(
      method === 'email' ? { email: contact } : { phone: contact }
    );
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1 request per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (existingUser.lastResetRequest && existingUser.lastResetRequest >= today) {
      return res.status(429).json({ message: "You can only request password reset once per day." });
    }

    // Generate new password
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.findByIdAndUpdate(existingUser._id, {
      password: hashedPassword,
      lastResetRequest: new Date(),
    });

    // Send password
    if (method === 'email') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact,
        subject: "Your New Password",
        text: `Your new password is: ${newPassword}. Please log in and change it immediately.`,
      });
    } else {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your new password is: ${newPassword}. Please log in and change it immediately.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact,
      });
    }

    res.status(200).json({ message: "Password reset successfully. Check your email or SMS." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
