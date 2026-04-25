import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedMyProfile from "./routes/ProtectedMyProfile";

const Followers = lazy(() => import("./pages/My-Profile/Followers"));
const Favorites = lazy(() => import("./pages/My-Profile/Favorites"));
const AddBlog = lazy(() => import("./pages/My-Profile/AddBlog"));
const Chats = lazy(() => import("./pages/My-Profile/chat/Chats"));
const Notifications = lazy(() => import("./pages/My-Profile/Notifications"));
const Settings = lazy(() => import("./pages/My-Profile/Settings"));

import Home from "./pages/Home";
import OAuthSuccess from "./components/feedback/OAuthSuccess";
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const GetStarted = lazy(() => import("./pages/GetStarted"));

const UserProfile = lazy(() => import("./pages/Users/UserProfile"));

const RoadmapPage = lazy(() => import("./features/Roadmap/RoadmapPage"));
const CodingLibs = lazy(() => import("./features/CodingLibs/CodingLibs"));
const Books = lazy(() => import("./features/CodingLibs/Books"));
const Docs = lazy(() => import("./features/CodingLibs/Docs"));
const CodingChallenges = lazy(
  () => import("./features/CodingChallenges/CodingChallenges"),
);

const Fundamentals = lazy(() => import("./pages/CategoryPages/Fundamentals"));
const FullStack = lazy(() => import("./pages/CategoryPages/FullStack"));
const Backend = lazy(() => import("./pages/CategoryPages/Backend"));
const Mobile = lazy(() => import("./pages/CategoryPages/Mobile"));
const AIandML = lazy(() => import("./pages/CategoryPages/AI&ML"));
const QA = lazy(() => import("./pages/CategoryPages/QA"));
const DevOps = lazy(() => import("./pages/CategoryPages/DevOps"));
const GameDev = lazy(() => import("./pages/CategoryPages/GameDev"));

const ReadMore = lazy(() => import("./components/blog/ReadMore"));
const NotFound = lazy(() => import("./components/feedback/NotFound"));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "roadmaps", element: <RoadmapPage /> },
      { path: "oauth-success", element: <OAuthSuccess /> },

      {
        path: "coding-libs",
        children: [
          {
            index: true,
            element: <CodingLibs />,
          },
          { path: "books", element: <Books /> },
          {
            path: "docs",
            element: <Docs />,
          },
        ],
      },
      { path: "coding-challenges", element: <CodingChallenges /> },
      { path: "get-started", element: <GetStarted /> },
      { path: "users/:username", element: <UserProfile /> },
      {
        path: "my-profile",
        children: [
          {
            index: true,
            element: (
              <ProtectedMyProfile>
                <MyProfile />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedMyProfile>
                <Settings />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "followers",
            element: (
              <ProtectedMyProfile>
                <Followers />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "following",
            element: (
              <ProtectedMyProfile>
                <Followers />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "add-blog",
            element: (
              <ProtectedMyProfile>
                <AddBlog />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "chats",
            element: (
              <ProtectedMyProfile>
                <Chats />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "notifications",
            element: (
              <ProtectedMyProfile>
                <Notifications />
              </ProtectedMyProfile>
            ),
          },
          {
            path: "favourites",
            element: (
              <ProtectedMyProfile>
                <Favorites />
              </ProtectedMyProfile>
            ),
          },
        ],
      },
      {
        path: "categories",
        errorElement: <NotFound />,
        children: [
          { path: "fundamentals", element: <Fundamentals /> },
          { path: "fullstack", element: <FullStack /> },
          { path: "fullstack/post/:id", element: <ReadMore /> },

          { path: "backend", element: <Backend /> },
          { path: "backend/post/:id", element: <ReadMore /> },

          { path: "mobile", element: <Mobile /> },
          { path: "mobile/post/:id", element: <ReadMore /> },

          { path: "ai&ml", element: <AIandML /> },
          { path: "ai&ml/post/:id", element: <ReadMore /> },

          { path: "qa", element: <QA /> },
          { path: "qa/post/:id", element: <ReadMore /> },

          { path: "devops", element: <DevOps /> },
          { path: "devops/post/:id", element: <ReadMore /> },

          { path: "gamedev", element: <GameDev /> },
          { path: "gamedev/post/:id", element: <ReadMore /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
export default router;
