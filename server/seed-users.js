import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/auth.js"; // adjust path if needed

dotenv.config();
console.log(process.env.MONGODB_URL);

if (!process.env.MONGODB_URL) {
  console.error("Error: MONGODB_URL is not defined in your .env file");
  process.exit(1);
}

// Sample data pools for randomization
const sampleNames = [
  "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Eve Adams", "Frank Miller", "Grace Lee", "Henry Wilson", "Ivy Davis", "Jack Taylor",
  "Kara Kent", "Liam Garcia", "Mia Rodriguez", "Noah Martinez", "Olivia Lopez", "Parker Anderson", "Quinn Thomas", "Ryan Jackson", "Sophia White", "Tyler Harris",
  // Add more for variety
];

const sampleEmails = [
  "alice@example.com", "bob@example.com", "charlie@example.com", "diana@example.com", "eve@example.com", "frank@example.com", "grace@example.com", "henry@example.com", "ivy@example.com", "jack@example.com",
  // Add more
];

const samplePhones = [
  "+1234567890", "+1987654321", "+1123456789", "+1555123456", "+1444987654", "+1777888999", "+1666777888", "+1999888777", "+1888777666", "+1223344556",
  // Add more
];

const sampleAbouts = [
  "Passionate developer with 5 years of experience in full-stack development.",
  "Tech enthusiast and open-source contributor.",
  "Software engineer specializing in React and Node.js.",
  "Data scientist and machine learning hobbyist.",
  "UI/UX designer turned full-stack developer.",
  // Add more
];

const sampleTags = [
  ["javascript", "react", "nodejs"],
  ["python", "django", "machine-learning"],
  ["css", "html", "frontend"],
  ["mongodb", "mongoose", "database"],
  ["git", "version-control", "teams"],
  ["authentication", "jwt", "security"],
  // Add more combinations
];

// Function to generate random date within the last year
function randomDate() {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  return new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
}

// Function to generate random friends (0-10 ObjectIds)
function generateFriends() {
  const numFriends = Math.floor(Math.random() * 11); // 0 to 10
  const friends = [];
  for (let i = 0; i < numFriends; i++) {
    friends.push(new mongoose.Types.ObjectId()); // Generate random ObjectId
  }
  return friends;
}

// Generate 200 users
const users = [];
for (let i = 0; i < 200; i++) {
  const hasPhone = Math.random() > 0.5; // 50% chance of having a phone
  users.push({
    name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
    email: `${sampleEmails[Math.floor(Math.random() * sampleEmails.length)].split('@')[0]}${i}@example.com`, // Ensure uniqueness
    phone: hasPhone ? samplePhones[Math.floor(Math.random() * samplePhones.length)] : undefined,
    password: "password123", // Dummy password; hash in production!
    about: Math.random() > 0.3 ? sampleAbouts[Math.floor(Math.random() * sampleAbouts.length)] : undefined, // 70% chance
    tags: sampleTags[Math.floor(Math.random() * sampleTags.length)],
    joinDate: randomDate(),
    lastResetRequest: null, // Default
    friends: generateFriends(),
  });
}

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    await User.deleteMany({});
    console.log("Existing users cleared");

    await User.insertMany(users);
    console.log("Users seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();


// Output the array (you can copy this JSON and use it directly)
console.log(JSON.stringify(users, null, 2));