import mongoose from "mongoose";
import dotenv from "dotenv";
import Tag from "./models/Tags.js"; // adjust path if needed

dotenv.config();
console.log(process.env.MONGODB_URL);

if (!process.env.MONGODB_URL) {
  console.error("Error: MONGODB_URL is not defined in your .env file");
  process.exit(1);
}

const TAGS = [
  { name: "javascript", description: "For questions about programming in ECMAScript (JavaScript/JS) and its dialects.", questions: 2534218, askedToday: 21, askedWeek: 158 },
  { name: "python", description: "Python is a dynamically typed, multi-purpose programming language.", questions: 2222436, askedToday: 52, askedWeek: 302 },
  { name: "java", description: "Java is a high-level object-oriented programming language.", questions: 1923449, askedToday: 24, askedWeek: 114 },
  { name: "c#", description: "C# is a multi-paradigm programming language developed by Microsoft.", questions: 1627564, askedToday: 25, askedWeek: 97 },
  { name: "html", description: "HTML is the markup language for creating web pages.", questions: 1190766, askedToday: 8, askedWeek: 75 },
  { name: "css", description: "CSS is the styling language for describing the look of HTML.", questions: 809509, askedToday: 6, askedWeek: 62 },

  { name: "reactjs", description: "React is a JavaScript library for building user interfaces.", questions: 623451, askedToday: 18, askedWeek: 131 },
  { name: "nextjs", description: "Next.js is a React framework for server-side rendering and static site generation.", questions: 214563, askedToday: 16, askedWeek: 101 },
  { name: "node.js", description: "Node.js is a JavaScript runtime built on Chrome's V8 engine.", questions: 1123444, askedToday: 20, askedWeek: 142 },
  { name: "express", description: "Express is a fast minimal framework for Node.js.", questions: 543221, askedToday: 12, askedWeek: 88 },

  { name: "mongodb", description: "MongoDB is a NoSQL document-oriented database.", questions: 456782, askedToday: 11, askedWeek: 64 },
  { name: "mysql", description: "MySQL is an open-source relational database management system.", questions: 985234, askedToday: 14, askedWeek: 92 },
  { name: "postgresql", description: "PostgreSQL is a powerful open-source relational database.", questions: 478901, askedToday: 9, askedWeek: 71 },

  { name: "typescript", description: "TypeScript is a typed superset of JavaScript.", questions: 712345, askedToday: 19, askedWeek: 143 },
  { name: "firebase", description: "Firebase provides backend services like authentication, Firestore, and hosting.", questions: 345678, askedToday: 13, askedWeek: 99 },
  { name: "flutter", description: "Flutter is Google's UI toolkit for building cross-platform apps.", questions: 634522, askedToday: 17, askedWeek: 121 },
  { name: "dart", description: "Dart is a programming language optimized for UI applications.", questions: 185332, askedToday: 7, askedWeek: 52 },

  { name: "android", description: "For questions related to Android mobile app development.", questions: 1923344, askedToday: 27, askedWeek: 167 },
  { name: "swift", description: "Swift is a powerful programming language for iOS and macOS development.", questions: 543225, askedToday: 14, askedWeek: 86 },
  { name: "kotlin", description: "Kotlin is a concise JVM language used heavily for Android.", questions: 334522, askedToday: 15, askedWeek: 90 },

  { name: "php", description: "PHP is a widely-used server-side scripting language.", questions: 1423231, askedToday: 10, askedWeek: 72 },
  { name: "laravel", description: "Laravel is a PHP web framework with expressive syntax.", questions: 623455, askedToday: 11, askedWeek: 81 },

  { name: "redux", description: "Redux is a predictable state container for JavaScript apps.", questions: 245221, askedToday: 5, askedWeek: 40 },
  { name: "vite", description: "Vite is a fast frontend build tool.", questions: 78511, askedToday: 4, askedWeek: 29 },
  { name: "webpack", description: "Webpack is a module bundler for JavaScript applications.", questions: 302544, askedToday: 7, askedWeek: 46 },

  { name: "tailwindcss", description: "Tailwind CSS is a utility-first CSS framework.", questions: 125543, askedToday: 10, askedWeek: 63 },
  { name: "bootstrap", description: "Bootstrap is a CSS framework for responsive design.", questions: 654332, askedToday: 6, askedWeek: 52 },

  { name: "graphql", description: "GraphQL is a query language for APIs.", questions: 167542, askedToday: 7, askedWeek: 49 },
  { name: "rest-api", description: "REST API refers to web services following REST architecture.", questions: 743122, askedToday: 9, askedWeek: 65 },
  { name: "docker", description: "Docker is a platform for containerizing applications.", questions: 534233, askedToday: 13, askedWeek: 88 },
  { name: "kubernetes", description: "Kubernetes is an orchestration system for containerized applications.", questions: 233511, askedToday: 8, askedWeek: 54 },

  { name: "git", description: "Git is a distributed version control system.", questions: 843221, askedToday: 12, askedWeek: 76 },
  { name: "github", description: "GitHub is a platform for hosting Git repositories.", questions: 143212, askedToday: 5, askedWeek: 36 },
  { name: "linux", description: "Linux is a family of open-source Unix-like operating systems.", questions: 934552, askedToday: 19, askedWeek: 125 },
  { name: "bash", description: "Bash is a Unix shell and command language.", questions: 543228, askedToday: 8, askedWeek: 59 },

  { name: "c", description: "C is a general-purpose, low-level programming language.", questions: 1623341, askedToday: 18, askedWeek: 113 },
  { name: "c++", description: "C++ is a general-purpose language with object-oriented features.", questions: 1534555, askedToday: 19, askedWeek: 120 },
  { name: "go", description: "Go is an open-source language designed for simplicity and efficiency.", questions: 345554, askedToday: 10, askedWeek: 68 },
  { name: "rust", description: "Rust is a systems programming language focused on safety and speed.", questions: 175322, askedToday: 9, askedWeek: 57 },

  { name: "pandas", description: "Pandas is a Python library for data manipulation and analysis.", questions: 543221, askedToday: 15, askedWeek: 104 },
  { name: "numpy", description: "NumPy provides support for arrays and numerical operations in Python.", questions: 432110, askedToday: 11, askedWeek: 79 },
  { name: "matplotlib", description: "Matplotlib is a plotting library for Python.", questions: 165432, askedToday: 5, askedWeek: 36 },
  { name: "tensorflow", description: "TensorFlow is a deep learning framework developed by Google.", questions: 365441, askedToday: 12, askedWeek: 89 },
  { name: "pytorch", description: "PyTorch is a machine learning framework for building neural networks.", questions: 275411, askedToday: 11, askedWeek: 83 },
  { name: "machine-learning", description: "Covers ML theory, algorithms, and implementations.", questions: 865441, askedToday: 17, askedWeek: 128 },
  { name: "ai", description: "Artificial Intelligence topics including search, logic, and reasoning.", questions: 154221, askedToday: 4, askedWeek: 24 },

  { name: "aws", description: "Amazon Web Services provides cloud computing services.", questions: 632441, askedToday: 14, askedWeek: 100 },
  { name: "azure", description: "Azure is Microsoft's cloud computing platform.", questions: 344321, askedToday: 9, askedWeek: 60 },
  { name: "google-cloud", description: "Google Cloud Platform provides cloud computing services.", questions: 287654, askedToday: 7, askedWeek: 45 },

  { name: "seo", description: "SEO refers to search engine optimization.", questions: 165443, askedToday: 2, askedWeek: 16 },
  { name: "testing", description: "Software testing techniques, tools, and frameworks.", questions: 455231, askedToday: 6, askedWeek: 38 },
  { name: "jest", description: "Jest is a JavaScript testing framework.", questions: 145320, askedToday: 4, askedWeek: 22 },
  { name: "cypress", description: "Cypress is an end-to-end testing framework.", questions: 122210, askedToday: 5, askedWeek: 30 },

  { name: "three.js", description: "Three.js is a JavaScript 3D library.", questions: 113254, askedToday: 3, askedWeek: 18 },
  { name: "webgl", description: "WebGL is a JavaScript API for rendering 3D graphics.", questions: 99354, askedToday: 2, askedWeek: 14 },
  { name: "blender", description: "Blender is an open-source 3D creation suite.", questions: 187422, askedToday: 6, askedWeek: 41 },

  { name: "sass", description: "Sass is a preprocessor that adds power to CSS.", questions: 254222, askedToday: 5, askedWeek: 34 },
  { name: "jquery", description: "jQuery is a JavaScript library that simplifies DOM manipulation.", questions: 2221344, askedToday: 4, askedWeek: 30 },

  { name: "redux-toolkit", description: "RTK simplifies Redux state management.", questions: 67542, askedToday: 2, askedWeek: 14 },
  { name: "socket.io", description: "Socket.IO enables real-time bidirectional communication.", questions: 157842, askedToday: 7, askedWeek: 51 },

  { name: "vitepress", description: "VitePress is a static site generator built on Vite.", questions: 21354, askedToday: 1, askedWeek: 7 },
  { name: "nuxtjs", description: "Nuxt.js is a framework for building Vue applications.", questions: 183544, askedToday: 6, askedWeek: 44 },
  { name: "vuejs", description: "Vue.js is a progressive JavaScript framework.", questions: 543221, askedToday: 9, askedWeek: 61 },

  { name: "deno", description: "Deno is a secure runtime for JavaScript and TypeScript.", questions: 31254, askedToday: 2, askedWeek: 10 },
  { name: "svelte", description: "Svelte is a component framework that compiles at build time.", questions: 85344, askedToday: 4, askedWeek: 28 },

  { name: "vercel", description: "Vercel is a deployment platform for modern web applications.", questions: 44522, askedToday: 2, askedWeek: 12 },
  { name: "netlify", description: "Netlify is a cloud platform for deploying web apps.", questions: 39211, askedToday: 1, askedWeek: 8 },

  { name: "jira", description: "Jira is a project and issue tracking tool.", questions: 156722, askedToday: 3, askedWeek: 19 },
  { name: "trello", description: "Trello is a visual project management tool.", questions: 43210, askedToday: 1, askedWeek: 6 },

  { name: "json", description: "JSON is a lightweight data-interchange format.", questions: 754332, askedToday: 8, askedWeek: 54 },
  { name: "regex", description: "Regex is used for string pattern matching.", questions: 665554, askedToday: 6, askedWeek: 49 },

  { name: "ubuntu", description: "Ubuntu is a Linux distribution based on Debian.", questions: 312354, askedToday: 9, askedWeek: 57 },
  { name: "vim", description: "Vim is a highly configurable text editor.", questions: 143211, askedToday: 2, askedWeek: 18 },
  { name: "nginx", description: "Nginx is a high-performance web server and reverse proxy.", questions: 189443, askedToday: 5, askedWeek: 33 },
  { name: "apache", description: "Apache HTTP Server is an open-source web server.", questions: 332422, askedToday: 4, askedWeek: 26 },

  { name: "elasticsearch", description: "Elasticsearch is a distributed search engine.", questions: 211543, askedToday: 6, askedWeek: 39 },
  { name: "redis", description: "Redis is an in-memory data structure store.", questions: 198522, askedToday: 5, askedWeek: 32 },

  { name: "svg", description: "SVG is an XML-based vector image format.", questions: 112344, askedToday: 2, askedWeek: 15 },
  { name: "canvas", description: "HTML canvas element is used to draw graphics.", questions: 164232, askedToday: 3, askedWeek: 22 },

  { name: "email", description: "Covers email protocols and sending/receiving email.", questions: 233541, askedToday: 4, askedWeek: 28 },
  { name: "jwt", description: "JSON Web Tokens are used for authentication.", questions: 85422, askedToday: 3, askedWeek: 17 },
];


const seedTags = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    await Tag.deleteMany({});
    console.log("Existing tags cleared");

    await Tag.insertMany(TAGS);
    console.log("Tags seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedTags();
