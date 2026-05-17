import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import connectDB from "../config/db.js";

const imgs = {
  react: "../../src/assets/blog-pics/fs1React.jpg",
  api:   "../../src/assets/blog-pics/BuildingRestApi.png",
  mongo: "../../src/assets/blog-pics/nodejsmongodb.png",
  auth:  "../../src/assets/blog-pics/AuthStrategiesBack.png",
  cache: "../../src/assets/blog-pics/caching.png",
  scale: "../../src/assets/blog-pics/scalabledesign.png",
};

const authors = {
  johnDoe:      { firstName: "John",    lastName: "Doe",    userName: "@johndoe",     pictures: "../../src/assets/postsProfiles/JohnDoe.png" },
  adaByte:      { firstName: "Ada",     lastName: "Byte",   userName: "@adabyte",     pictures: "../../src/assets/postsProfiles/AdaByte.png" },
  dmitryPetrov: { firstName: "Dmitry",  lastName: "Petrov", userName: "@dmit_petrov", pictures: "../../src/assets/postsProfiles/DmitryPetrov.png" },
  graceHopper:  { firstName: "Grace",   lastName: "Hopper", userName: "@gracehopper", pictures: "../../src/assets/postsProfiles/GraceHopper.png" },
  aliceKeyes:   { firstName: "Alice",   lastName: "Keyes",  userName: "@alice_keys",  pictures: "../../src/assets/postsProfiles/AliceKeyes.png" },
  williamChen:  { firstName: "William", lastName: "Chen",   userName: "@will_chen",   pictures: "../../src/assets/postsProfiles/WilliamChen.png" },
};

const defaultPosts = [
  // ── FULLSTACK ──────────────────────────────────────────────
  { title: "Learn MERN Stack Basics",           slug: "learn-mern-stack-basics",            category: "fullstack", difficulty: "Beginner",      description: "Learn how to build a MERN stack application from scratch with best practices.",               content: "", coverImage: imgs.react, author: authors.johnDoe,      readTime: 5, tags: ["mern", "fullstack", "react"],      wordCount: 0 },
  { title: "Connect React with Express",         slug: "connect-react-with-express",          category: "fullstack", difficulty: "Beginner",      description: "A guide to connecting React frontend with Express backend efficiently.",                       content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 6, tags: ["react", "express", "api"],         wordCount: 0 },
  { title: "Structuring Fullstack Projects",     slug: "structuring-fullstack-projects",      category: "fullstack", difficulty: "Intermediate",  description: "Tips on structuring fullstack projects for scalability and maintainability.",                  content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 7, tags: ["fullstack", "architecture"],       wordCount: 0 },
  { title: "Authentication Flows in Fullstack",  slug: "authentication-flows-in-fullstack",   category: "fullstack", difficulty: "Intermediate",  description: "Understanding authentication flows — JWT, sessions, and OAuth in fullstack apps.",            content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 8, tags: ["auth", "jwt", "oauth"],            wordCount: 0 },
  { title: "Deploy Fullstack App to Cloud",      slug: "deploy-fullstack-app-to-cloud",       category: "fullstack", difficulty: "Intermediate",  description: "Deploying a fullstack app to the cloud using modern tools like Railway and Vercel.",          content: "", coverImage: imgs.api,   author: authors.adaByte,       readTime: 6, tags: ["deploy", "vercel", "railway"],     wordCount: 0 },
  { title: "Managing State in Fullstack",        slug: "managing-state-in-fullstack",         category: "fullstack", difficulty: "Beginner",      description: "Managing state and API calls efficiently in a fullstack project.",                             content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 5, tags: ["state", "zustand", "react"],       wordCount: 0 },

  // ── BACKEND ───────────────────────────────────────────────
  { title: "Building RESTful APIs",              slug: "building-restful-apis",               category: "backend",   difficulty: "Beginner",      description: "Building RESTful APIs with Node.js and Express — routing, middleware, and best practices.",  content: "", coverImage: imgs.api,   author: authors.johnDoe,      readTime: 6, tags: ["api", "rest", "express"],          wordCount: 0 },
  { title: "Microservices Architecture Intro",   slug: "microservices-architecture-intro",    category: "backend",   difficulty: "Advanced",      description: "Introduction to microservices architecture for scalable backend systems.",                    content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 7, tags: ["microservices", "backend"],        wordCount: 0 },
  { title: "Auth Strategies for Backend",        slug: "auth-strategies-for-backend",         category: "backend",   difficulty: "Intermediate",  description: "Authentication and authorization strategies — JWT, OAuth, and session management.",          content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 8, tags: ["auth", "jwt", "security"],         wordCount: 0 },
  { title: "Node.js + MongoDB Connection",       slug: "nodejs-mongodb-connection",           category: "backend",   difficulty: "Beginner",      description: "Connecting Node.js to MongoDB for data persistence using Mongoose.",                         content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 5, tags: ["nodejs", "mongodb", "mongoose"],   wordCount: 0 },
  { title: "Caching and Optimization",           slug: "caching-and-optimization",            category: "backend",   difficulty: "Intermediate",  description: "Implementing caching with Redis and optimization techniques in backend services.",           content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 6, tags: ["redis", "caching", "performance"], wordCount: 0 },
  { title: "API Security with JWT & OAuth",      slug: "api-security-with-jwt-and-oauth",     category: "backend",   difficulty: "Intermediate",  description: "Securing your APIs with JWT tokens, refresh flows, and OAuth best practices.",              content: "", coverImage: imgs.react, author: authors.adaByte,       readTime: 7, tags: ["security", "jwt", "oauth"],        wordCount: 0 },

  // ── MOBILE ────────────────────────────────────────────────
  { title: "React Native Basics",                slug: "react-native-basics",                 category: "mobile",    difficulty: "Beginner",      description: "Getting started with React Native for cross-platform iOS and Android apps.",                 content: "", coverImage: imgs.react, author: authors.johnDoe,      readTime: 5, tags: ["react-native", "mobile"],          wordCount: 0 },
  { title: "Responsive Mobile UI Design",        slug: "responsive-mobile-ui-design",         category: "mobile",    difficulty: "Beginner",      description: "Building responsive mobile UI with Flexbox and best design practices.",                      content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 6, tags: ["ui", "flexbox", "mobile"],         wordCount: 0 },
  { title: "Navigation in Mobile Apps",          slug: "navigation-in-mobile-apps",           category: "mobile",    difficulty: "Beginner",      description: "Handling navigation and routing in React Native with React Navigation.",                     content: "", coverImage: imgs.api,   author: authors.johnDoe,      readTime: 5, tags: ["navigation", "react-native"],      wordCount: 0 },
  { title: "State Management in React Native",   slug: "state-management-in-react-native",    category: "mobile",    difficulty: "Intermediate",  description: "Managing state in React Native applications using Context and Zustand.",                     content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 7, tags: ["state", "zustand", "mobile"],      wordCount: 0 },
  { title: "Integrating APIs in Mobile Apps",    slug: "integrating-apis-in-mobile-apps",     category: "mobile",    difficulty: "Intermediate",  description: "Integrating REST APIs and backend services in mobile apps with fetch and axios.",           content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 6, tags: ["api", "fetch", "mobile"],          wordCount: 0 },
  { title: "Optimizing Mobile Performance",      slug: "optimizing-mobile-performance",       category: "mobile",    difficulty: "Advanced",      description: "Optimizing React Native app performance — lazy loading, memoization, and profiling.",       content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 8, tags: ["performance", "mobile"],           wordCount: 0 },

  // ── AI & ML ───────────────────────────────────────────────
  { title: "Intro to Supervised Learning",       slug: "intro-to-supervised-learning",        category: "ai&ml",     difficulty: "Beginner",      description: "Introduction to supervised and unsupervised learning algorithms with examples.",            content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 6, tags: ["ml", "supervised", "python"],      wordCount: 0 },
  { title: "First ML Model with Python",         slug: "first-ml-model-with-python",          category: "ai&ml",     difficulty: "Beginner",      description: "Building your first machine learning model using scikit-learn and Python.",                  content: "", coverImage: imgs.react, author: authors.johnDoe,      readTime: 7, tags: ["ml", "scikit-learn", "python"],    wordCount: 0 },
  { title: "Data Preprocessing Techniques",      slug: "data-preprocessing-techniques",       category: "ai&ml",     difficulty: "Intermediate",  description: "Data preprocessing and feature engineering techniques for better model accuracy.",          content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 6, tags: ["data", "preprocessing", "ml"],     wordCount: 0 },
  { title: "Neural Networks Basics",             slug: "neural-networks-basics",              category: "ai&ml",     difficulty: "Intermediate",  description: "Understanding neural networks, layers, activation functions, and deep learning basics.",    content: "", coverImage: imgs.api,   author: authors.johnDoe,      readTime: 8, tags: ["neural-networks", "deep-learning"],wordCount: 0 },
  { title: "Evaluating ML Models",               slug: "evaluating-ml-models",                category: "ai&ml",     difficulty: "Intermediate",  description: "Evaluating model performance — accuracy, precision, recall, F1, and confusion matrix.",    content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 5, tags: ["ml", "evaluation", "metrics"],     wordCount: 0 },
  { title: "Applying ML in Real Projects",       slug: "applying-ml-in-real-projects",        category: "ai&ml",     difficulty: "Advanced",      description: "Applying machine learning in real-world applications and production environments.",         content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 7, tags: ["ml", "production", "ai"],          wordCount: 0 },

  // ── QA ────────────────────────────────────────────────────
  { title: "Manual Testing Strategies",          slug: "manual-testing-strategies",           category: "qa",        difficulty: "Beginner",      description: "Manual testing strategies and creating effective, reusable test cases.",                    content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 5, tags: ["testing", "qa", "manual"],         wordCount: 0 },
  { title: "Intro to Automated Testing",         slug: "intro-to-automated-testing",          category: "qa",        difficulty: "Beginner",      description: "Introduction to automated testing frameworks — Jest, Cypress, and Playwright.",             content: "", coverImage: imgs.api,   author: authors.johnDoe,      readTime: 6, tags: ["jest", "playwright", "qa"],        wordCount: 0 },
  { title: "Bug Tracking Best Practices",        slug: "bug-tracking-best-practices",         category: "qa",        difficulty: "Beginner",      description: "Bug tracking and reporting best practices using tools like Jira and Linear.",               content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 5, tags: ["bugs", "jira", "qa"],              wordCount: 0 },
  { title: "Understanding QA Processes",         slug: "understanding-qa-processes",          category: "qa",        difficulty: "Intermediate",  description: "Understanding QA processes in agile software development pipelines.",                        content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 6, tags: ["qa", "agile", "process"],          wordCount: 0 },
  { title: "Load & Performance Testing",         slug: "load-and-performance-testing",        category: "qa",        difficulty: "Intermediate",  description: "Load and performance testing essentials using k6, Artillery, and JMeter.",                  content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 7, tags: ["performance", "k6", "testing"],    wordCount: 0 },
  { title: "Writing Efficient Test Scripts",     slug: "writing-efficient-test-scripts",      category: "qa",        difficulty: "Intermediate",  description: "Writing clean, efficient, and maintainable test scripts for automation suites.",            content: "", coverImage: imgs.react, author: authors.johnDoe,      readTime: 6, tags: ["automation", "scripts", "qa"],     wordCount: 0 },

  // ── DEVOPS ────────────────────────────────────────────────
  { title: "CI/CD with GitHub Actions",          slug: "cicd-with-github-actions",            category: "devops",    difficulty: "Intermediate",  description: "Setting up CI/CD pipelines using GitHub Actions for automated builds and deploys.",        content: "", coverImage: imgs.api,   author: authors.johnDoe,      readTime: 6, tags: ["cicd", "github-actions", "devops"],wordCount: 0 },
  { title: "Containerization with Docker",       slug: "containerization-with-docker",        category: "devops",    difficulty: "Beginner",      description: "Containerization with Docker — Dockerfiles, images, volumes, and best practices.",        content: "", coverImage: imgs.scale, author: authors.dmitryPetrov,  readTime: 7, tags: ["docker", "containers"],            wordCount: 0 },
  { title: "Kubernetes Orchestration",           slug: "kubernetes-orchestration",            category: "devops",    difficulty: "Advanced",      description: "Orchestrating containers with Kubernetes — pods, services, and deployments.",              content: "", coverImage: imgs.mongo, author: authors.aliceKeyes,    readTime: 8, tags: ["kubernetes", "k8s", "devops"],     wordCount: 0 },
  { title: "Monitoring & Logging",               slug: "monitoring-and-logging",              category: "devops",    difficulty: "Intermediate",  description: "Monitoring and logging in cloud environments with Prometheus, Grafana, and Loki.",         content: "", coverImage: imgs.cache, author: authors.williamChen,   readTime: 6, tags: ["monitoring", "grafana", "devops"], wordCount: 0 },
  { title: "Infrastructure as Code",             slug: "infrastructure-as-code",              category: "devops",    difficulty: "Intermediate",  description: "Infrastructure as Code with Terraform — provisioning and managing cloud resources.",       content: "", coverImage: imgs.auth,  author: authors.graceHopper,   readTime: 7, tags: ["terraform", "iac", "devops"],      wordCount: 0 },
  { title: "Automating Deployments",             slug: "automating-deployments",              category: "devops",    difficulty: "Beginner",      description: "Automating deployments and server management using scripts and CI/CD pipelines.",          content: "", coverImage: imgs.react, author: authors.johnDoe,      readTime: 5, tags: ["deploy", "automation", "devops"],  wordCount: 0 },
];

defaultPosts.forEach((post, i) => {
  post.id        = i;
  post.isDefault = true;
  post.status    = "published";
  post.likes     = [];
  post.views     = 0;
  post.createdAt = new Date();
  post.updatedAt = new Date();
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
