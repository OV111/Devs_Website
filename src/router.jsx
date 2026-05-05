import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Home from "./pages/Home";
import OAuthSuccess from "./components/feedback/OAuthSuccess";
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const ReadMore = lazy(() => import("./components/blog/ReadMore"));
const NotFound = lazy(() => import("./components/feedback/NotFound"));

const UserProfile = lazy(() => import("./pages/Users/UserProfile"));
const Followers = lazy(() => import("./pages/My-Profile/Followers"));
const Favorites = lazy(() => import("./pages/My-Profile/Favorites"));
const AddBlog = lazy(() => import("./pages/My-Profile/AddBlog"));
const Chats = lazy(() => import("./pages/My-Profile/chat/Chats"));
const Notifications = lazy(() => import("./pages/My-Profile/Notifications"));
const Settings = lazy(() => import("./pages/My-Profile/Settings"));

const Blogs = lazy(() => import("./features/Blogs/Blogs"));
const RoadmapPage = lazy(() => import("./features/Roadmap/RoadmapPage"));
const CodingLibs = lazy(() => import("./features/CodingLibs/CodingLibs"));
const Books = lazy(() => import("./features/CodingLibs/Books"));
const Docs = lazy(() => import("./features/CodingLibs/Docs"));
const CodingChallenges = lazy(() => import("./features/CodingChallenges/CodingChallenges"));

const Fundamentals = lazy(() => import("./pages/CategoryPages/Fundamentals"));
const FullStack = lazy(() => import("./pages/CategoryPages/FullStack"));
const Backend = lazy(() => import("./pages/CategoryPages/Backend"));
const Mobile = lazy(() => import("./pages/CategoryPages/Mobile"));
const AIandML = lazy(() => import("./pages/CategoryPages/AI&ML"));
const QA = lazy(() => import("./pages/CategoryPages/QA"));
const DataScience = lazy(() => import("./pages/CategoryPages/DataScience"));
const DevOps = lazy(() => import("./pages/CategoryPages/DevOps"));
const GameDev = lazy(() => import("./pages/CategoryPages/GameDev"));


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      // ✅ Public routes — no wrapper needed
      { path: "/",             element: <Home /> },
      { path: "about",         element: <About /> },
      { path: "contact",       element: <Contact /> },
      { path: "privacy",       element: <Privacy /> },
      { path: "oauth-success", element: <OAuthSuccess /> },
      { path: "get-started",   element: <GetStarted /> },
      { path: "posts/:id",     element: <ReadMore /> },
      {
        path: "categories",
        children: [
          { path: "fundamentals", element: <Fundamentals /> },
          { path: "fullstack",    element: <FullStack /> },
          { path: "backend",      element: <Backend /> },
          { path: "mobile",       element: <Mobile /> },
          { path: "ai&ml",        element: <AIandML /> },
          { path: "devops",       element: <DevOps /> },
          { path: "datascience",  element: <DataScience /> },
          { path: "gamedev",      element: <GameDev /> },
          { path: "qa",           element: <QA /> },
        ],
      },
      // ✅ All protected routes grouped here — one wrapper for all
      {
        element: <ProtectedLayout />,
        children: [
          { path: "blogs",              element: <Blogs /> },
          { path: "roadmaps",           element: <RoadmapPage /> },
          { path: "coding-challenges",  element: <CodingChallenges /> },
          { path: "users/:username",    element: <UserProfile /> },
          {
            path: "coding-libs",
            children: [
              { index: true,   element: <CodingLibs /> },
              { path: "books", element: <Books /> },
              { path: "docs",  element: <Docs /> },
            ],
          },
          {
            path: "my-profile",
            children: [
              { index: true,              element: <MyProfile /> },
              { path: "settings",         element: <Settings /> },
              { path: "followers",        element: <Followers /> },
              { path: "following",        element: <Followers /> },
              { path: "add-blog",         element: <AddBlog /> },
              { path: "chats",            element: <Chats /> },
              { path: "notifications",    element: <Notifications /> },
              { path: "favourites",       element: <Favorites /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
export default router;
