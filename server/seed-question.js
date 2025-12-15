import { faker } from "@faker-js/faker"; 
import mongoose from "mongoose";
import dotenv from "dotenv";
import question from "./models/questions.js"; 

dotenv.config();
console.log(process.env.MONGODB_URL);

if (!process.env.MONGODB_URL) {
  console.error("Error: MONGODB_URL is not defined in your .env file");
  process.exit(1);
}
// Sample data pools for randomization
const sampleTitles = [
  "How to center a div in CSS?",
  "Best practices for React state management?",
  "Why is my JavaScript function not working?",
  "How to optimize MongoDB queries?",
  "Differences between let, const, and var in JS?",
  "How to handle async/await in Node.js?",
  "Troubleshooting CORS errors in Express?",
  "Implementing authentication with JWT?",
  "How to deploy a MERN stack app to Heroku?",
  "Understanding closures in JavaScript?",
  "Best way to handle form validation in React?",
  "How to use Mongoose for schema validation?",
  "Debugging memory leaks in Node.js?",
  "Creating responsive layouts with Flexbox?",
  "How to integrate Stripe payments in a web app?",
  "Optimizing images for web performance?",
  "Using Git for version control in teams?",
  "How to write unit tests with Jest?",
  "Handling errors in Express middleware?",
  "Building a REST API with Node.js?",
  // Add more as needed for variety
];

const sampleBodies = [
  "I'm trying to center a div but it's not working. Here's my code: [code snippet]. Any help?",
  "I've been using Redux for state, but it's getting complex. Are there better alternatives?",
  "My function throws an error: 'undefined is not a function'. What's wrong?",
  "My queries are slow. How can I add indexes or optimize them?",
  "Can someone explain the scope differences with examples?",
  "I'm getting promise rejections. How do I fix async code?",
  "CORS is blocking my API calls. What's the solution?",
  "I need to secure my app. How do I implement JWT tokens?",
  "Deployment keeps failing. Any tips for Heroku?",
  "Closures confuse me. Can you break it down?",
  // Add more as needed
];

const sampleTags = [
  ["css", "html", "frontend"],
  ["react", "javascript", "state-management"],
  ["javascript", "debugging", "functions"],
  ["mongodb", "mongoose", "database"],
  ["javascript", "variables", "es6"],
  ["nodejs", "async", "promises"],
  ["express", "cors", "api"],
  ["authentication", "jwt", "security"],
  ["deployment", "heroku", "mern"],
  ["javascript", "closures", "scope"],
  // Add more combinations
];

const sampleUsers = [
  "AliceDev", "BobCoder", "CharlieJS", "DianaReact", "EveNode", "FrankMongo", "GraceAPI", "HenryCSS", "IvyTest", "JackDeploy",
  // Add more for variety
];

const sampleUserIds = [
  "user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10",
  // Add more
];

// Function to generate random date within the last year
function randomDate() {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  return new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
}

// Function to generate random answers (0-5 per question)
function generateAnswers() {
  const numAnswers = Math.floor(Math.random() * 6); // 0 to 5
  const answers = [];
  for (let i = 0; i < numAnswers; i++) {
    answers.push({
      answerbody: `This is a sample answer ${i + 1}. Here's some advice: [code or explanation].`,
      useranswered: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
      userid: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
      answeredon: randomDate(),
    });
  }
  return answers;
}

// Function to generate random votes (upvote/downvote arrays)
function generateVotes() {
  const numUpvotes = Math.floor(Math.random() * 11); // 0-10
  const numDownvotes = Math.floor(Math.random() * 6); // 0-5
  const upvotes = [];
  const downvotes = [];
  for (let i = 0; i < numUpvotes; i++) {
    upvotes.push(sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)]);
  }
  for (let i = 0; i < numDownvotes; i++) {
    downvotes.push(sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)]);
  }
  return { upvotes, downvotes };
}

// Generate 200 questions
const questions = [];
for (let i = 0; i < 200; i++) {
  const answers = generateAnswers();
  const { upvotes, downvotes } = generateVotes();
  questions.push({
    questiontitle: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
    questionbody: sampleBodies[Math.floor(Math.random() * sampleBodies.length)],
    questiontags: sampleTags[Math.floor(Math.random() * sampleTags.length)],
    noofanswer: answers.length,
    upvote: upvotes,
    downvote: downvotes,
    userposted: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
    userid: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
    askedon: randomDate(),
    answer: answers,
  });
}

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    await question.deleteMany({});
    console.log("Existing questions cleared");

    await question.insertMany(questions);
    console.log("Questions seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedQuestions();

// Output the array (you can copy this JSON and use it directly)
// console.log(JSON.stringify(questions, null, 2));

