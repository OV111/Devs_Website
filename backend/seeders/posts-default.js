import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import connectDB from "../config/db.js";

const imgs = {
  react:    "../../src/assets/blog-pics/fs1React.jpg",
  api:      "../../src/assets/blog-pics/BuildingRestApi.png",
  mongo:    "../../src/assets/blog-pics/nodejsmongodb.png",
  auth:     "../../src/assets/blog-pics/AuthStrategiesBack.png",
  cache:    "../../src/assets/blog-pics/caching.png",
  scale:    "../../src/assets/blog-pics/scalabledesign.png",
};

const defaultPosts = [
  // ── FULLSTACK ──────────────────────────────────────────────
  { title: "Learn MERN Stack Basics",           category: "fullstack", description: "Learn how to build a MERN stack application from scratch with best practices.",               image: imgs.react,  readTime: "5 min" },
  { title: "Connect React with Express",         category: "fullstack", description: "A guide to connecting React frontend with Express backend efficiently.",                       image: imgs.mongo,  readTime: "6 min" },
  { title: "Structuring Fullstack Projects",     category: "fullstack", description: "Tips on structuring fullstack projects for scalability and maintainability.",                  image: imgs.scale,  readTime: "7 min" },
  { title: "Authentication Flows in Fullstack",  category: "fullstack", description: "Understanding authentication flows — JWT, sessions, and OAuth in fullstack apps.",            image: imgs.auth,   readTime: "8 min" },
  { title: "Deploy Fullstack App to Cloud",      category: "fullstack", description: "Deploying a fullstack app to the cloud using modern tools like Railway and Vercel.",          image: imgs.api,    readTime: "6 min" },
  { title: "Managing State in Fullstack",        category: "fullstack", description: "Managing state and API calls efficiently in a fullstack project.",                             image: imgs.cache,  readTime: "5 min" },

  // ── BACKEND ───────────────────────────────────────────────
  { title: "Building RESTful APIs",              category: "backend",   description: "Building RESTful APIs with Node.js and Express — routing, middleware, and best practices.",  image: imgs.api,    readTime: "6 min" },
  { title: "Microservices Architecture Intro",   category: "backend",   description: "Introduction to microservices architecture for scalable backend systems.",                    image: imgs.scale,  readTime: "7 min" },
  { title: "Auth Strategies for Backend",        category: "backend",   description: "Authentication and authorization strategies — JWT, OAuth, and session management.",          image: imgs.auth,   readTime: "8 min" },
  { title: "Node.js + MongoDB Connection",       category: "backend",   description: "Connecting Node.js to MongoDB for data persistence using Mongoose.",                         image: imgs.mongo,  readTime: "5 min" },
  { title: "Caching and Optimization",           category: "backend",   description: "Implementing caching with Redis and optimization techniques in backend services.",           image: imgs.cache,  readTime: "6 min" },
  { title: "API Security with JWT & OAuth",      category: "backend",   description: "Securing your APIs with JWT tokens, refresh flows, and OAuth best practices.",              image: imgs.react,  readTime: "7 min" },

  // ── MOBILE ────────────────────────────────────────────────
  { title: "React Native Basics",                category: "mobile",    description: "Getting started with React Native for cross-platform iOS and Android apps.",                 image: imgs.react,  readTime: "5 min" },
  { title: "Responsive Mobile UI Design",        category: "mobile",    description: "Building responsive mobile UI with Flexbox and best design practices.",                      image: imgs.scale,  readTime: "6 min" },
  { title: "Navigation in Mobile Apps",          category: "mobile",    description: "Handling navigation and routing in React Native with React Navigation.",                     image: imgs.api,    readTime: "5 min" },
  { title: "State Management in React Native",   category: "mobile",    description: "Managing state in React Native applications using Context and Zustand.",                     image: imgs.cache,  readTime: "7 min" },
  { title: "Integrating APIs in Mobile Apps",    category: "mobile",    description: "Integrating REST APIs and backend services in mobile apps with fetch and axios.",           image: imgs.mongo,  readTime: "6 min" },
  { title: "Optimizing Mobile Performance",      category: "mobile",    description: "Optimizing React Native app performance — lazy loading, memoization, and profiling.",       image: imgs.auth,   readTime: "8 min" },

  // ── AI & ML ───────────────────────────────────────────────
  { title: "Intro to Supervised Learning",       category: "ai&ml",     description: "Introduction to supervised and unsupervised learning algorithms with examples.",            image: imgs.scale,  readTime: "6 min" },
  { title: "First ML Model with Python",         category: "ai&ml",     description: "Building your first machine learning model using scikit-learn and Python.",                  image: imgs.react,  readTime: "7 min" },
  { title: "Data Preprocessing Techniques",      category: "ai&ml",     description: "Data preprocessing and feature engineering techniques for better model accuracy.",          image: imgs.cache,  readTime: "6 min" },
  { title: "Neural Networks Basics",             category: "ai&ml",     description: "Understanding neural networks, layers, activation functions, and deep learning basics.",    image: imgs.api,    readTime: "8 min" },
  { title: "Evaluating ML Models",               category: "ai&ml",     description: "Evaluating model performance — accuracy, precision, recall, F1, and confusion matrix.",    image: imgs.mongo,  readTime: "5 min" },
  { title: "Applying ML in Real Projects",       category: "ai&ml",     description: "Applying machine learning in real-world applications and production environments.",         image: imgs.auth,   readTime: "7 min" },

  // ── QA ────────────────────────────────────────────────────
  { title: "Manual Testing Strategies",          category: "qa",        description: "Manual testing strategies and creating effective, reusable test cases.",                    image: imgs.scale,  readTime: "5 min" },
  { title: "Intro to Automated Testing",         category: "qa",        description: "Introduction to automated testing frameworks — Jest, Cypress, and Playwright.",             image: imgs.api,    readTime: "6 min" },
  { title: "Bug Tracking Best Practices",        category: "qa",        description: "Bug tracking and reporting best practices using tools like Jira and Linear.",               image: imgs.cache,  readTime: "5 min" },
  { title: "Understanding QA Processes",         category: "qa",        description: "Understanding QA processes in agile software development pipelines.",                        image: imgs.mongo,  readTime: "6 min" },
  { title: "Load & Performance Testing",         category: "qa",        description: "Load and performance testing essentials using k6, Artillery, and JMeter.",                  image: imgs.auth,   readTime: "7 min" },
  { title: "Writing Efficient Test Scripts",     category: "qa",        description: "Writing clean, efficient, and maintainable test scripts for automation suites.",            image: imgs.react,  readTime: "6 min" },

  // ── DEVOPS ────────────────────────────────────────────────
  { title: "CI/CD with GitHub Actions",          category: "devops",    description: "Setting up CI/CD pipelines using GitHub Actions for automated builds and deploys.",        image: imgs.api,    readTime: "6 min" },
  { title: "Containerization with Docker",       category: "devops",    description: "Containerization with Docker — Dockerfiles, images, volumes, and best practices.",        image: imgs.scale,  readTime: "7 min" },
  { title: "Kubernetes Orchestration",           category: "devops",    description: "Orchestrating containers with Kubernetes — pods, services, and deployments.",              image: imgs.mongo,  readTime: "8 min" },
  { title: "Monitoring & Logging",               category: "devops",    description: "Monitoring and logging in cloud environments with Prometheus, Grafana, and Loki.",         image: imgs.cache,  readTime: "6 min" },
  { title: "Infrastructure as Code",             category: "devops",    description: "Infrastructure as Code with Terraform — provisioning and managing cloud resources.",       image: imgs.auth,   readTime: "7 min" },
  { title: "Automating Deployments",             category: "devops",    description: "Automating deployments and server management using scripts and CI/CD pipelines.",          image: imgs.react,  readTime: "5 min" },
];

// attach metadata
defaultPosts.forEach((post, i) => {
  post.id        = i;
  post.isDefault = true;
  post.likes     = "";
  post.views     = "";
  post.createdAt = Date.now();
});

const settingDefaultPosts = async () => {
  try {
    const db = await connectDB();
    const collectionPosts = db.collection("posts-default");

    console.log("Connected to DB ✅");

    await collectionPosts.deleteMany({});
    const result = await collectionPosts.insertMany(defaultPosts);

    console.log(`Inserted ${result.insertedCount} default posts ✅`);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting default posts:", err);
    process.exit(1);
  }
};

settingDefaultPosts();

// export default settingDefaultPosts;
