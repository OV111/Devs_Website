import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Home from "./pages/Home";
import OAuthSuccess from "./components/feedback/OAuthSuccess";
import PublicOnlyRoute from "./layouts/PublicOnlyRoute";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
const EditBlog = lazy(() => import("./pages/My-Profile/EditBlog"));
const MyBlogs = lazy(() => import("./pages/My-Profile/MyBlogs"));
const Chats = lazy(() => import("./pages/My-Profile/chat/Chats"));
const Notifications = lazy(() => import("./pages/My-Profile/Notifications"));
const Settings = lazy(() => import("./pages/My-Profile/Settings"));
const BlockedUsers = lazy(() => import("./pages/My-Profile/BlockedUsers"));
const ConnectedAccounts = lazy(
  () => import("./pages/My-Profile/ConnectedAccounts"),
);

const Blogs = lazy(() => import("./features/Blogs/Blogs"));
const RoadmapPage = lazy(() => import("./features/Roadmap/RoadmapPage"));
const ExamPage = lazy(() => import("./features/Roadmap/ExamPage"));
const LibsPage = lazy(() => import("./features/CodingLibs/LibsPage"));
const BookDetailPage = lazy(() => import("./features/CodingLibs/BookDetailPage"));
const CodingChallenges = lazy(
  () => import("./features/coding-challenges/CodingChallenges"),
);
const ChallengeArena = lazy(
  () => import("./features/coding-challenges/ChallengeArena"),
);
const ProposeChallenge = lazy(
  () => import("./features/coding-challenges/pages/ProposeChallenge"),
);
const ReviewProposals = lazy(
  () => import("./features/coding-challenges/pages/ReviewProposals"),
);
const AiAgent = lazy(() => import("./features/AI-Agent/AiAgent"));
const CapstonePage = lazy(() => import("./features/capstone/CapstonePage"));
const CertificatePage = lazy(() => import("./features/capstone/CertificatePage"));
const TeamPage = lazy(() => import("./features/teams/TeamPage"));
const TeamAdminPage = lazy(() => import("./features/teams/TeamAdminPage"));
const EvidencePage = lazy(() => import("./features/teams/EvidencePage"));
const CandidatePage = lazy(() => import("./features/recruiter/CandidatePage"));
const CapstoneAdminPage = lazy(() => import("./features/capstone/CapstoneAdminPage"));
const VoiceReviewPage = lazy(() => import("./features/VoiceReview/VoiceReviewPage"));
const PricingPage = lazy(() => import("./features/billing/PricingPage"));
const BillingPage = lazy(() => import("./features/billing/BillingPage"));
const ProgressPage = lazy(() => import("./features/mastery/ProgressPage"));

const Fundamentals = lazy(() => import("./pages/CategoryPages/Fundamentals"));
const FullStack = lazy(() => import("./pages/CategoryPages/FullStack"));
const Backend = lazy(() => import("./pages/CategoryPages/Backend"));
const Mobile = lazy(() => import("./pages/CategoryPages/Mobile"));
const Languages = lazy(() => import("./pages/CategoryPages/Languages"));
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
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "pricing", element: <PricingPage /> },
      // Public on purpose: guests browse the paths with every layer locked.
      // The exam route below stays protected.
      { path: "roadmaps", element: <RoadmapPage /> },
      { path: "oauth-success", element: <OAuthSuccess /> },
      {
        path: "get-started",
        element: (
          <PublicOnlyRoute>
            <GetStarted />
          </PublicOnlyRoute>
        ),
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "posts/:id", element: <ReadMore /> },
      // Public on purpose: certificates must be verifiable without an account.
      { path: "verify/:publicId", element: <CertificatePage /> },
      // Public on purpose: team evidence is meant for recruiters without an account.
      { path: "evidence/:publicId", element: <EvidencePage /> },
      // Public on purpose, but only for developers who opted in (the API answers 404 otherwise).
      { path: "candidate/:username", element: <CandidatePage /> },
      {
        path: "categories",
        children: [
          { path: "fundamentals", element: <Fundamentals /> },
          { path: "fullstack", element: <FullStack /> },
          { path: "backend", element: <Backend /> },
          { path: "mobile", element: <Mobile /> },
          { path: "ai&ml", element: <AIandML /> },
          { path: "devops", element: <DevOps /> },
          { path: "datascience", element: <DataScience /> },
          { path: "gamedev", element: <GameDev /> },
          { path: "qa", element: <QA /> },
          { path: "languages", element: <Languages /> },
        ],
      },
      // ✅ All protected routes grouped here — one wrapper for all
      {
        element: <ProtectedLayout />,
        children: [
          { path: "blogs", element: <Blogs /> },
          { path: "roadmaps/exam/:layerId", element: <ExamPage /> },
          { path: "libs", element: <LibsPage /> },
          { path: "libs/:id", element: <BookDetailPage /> },
          { path: "coding-challenges", element: <CodingChallenges /> },
          { path: "coding-challenges/propose", element: <ProposeChallenge /> },
          { path: "coding-challenges/review", element: <ReviewProposals /> },
          { path: "coding-challenges/:id", element: <ChallengeArena /> },
          // One shell for both: "new chat" is a state of AiAgent (the hero),
          // not a separate route. /ai-agent/chat is kept as a redirect so
          // existing links and bookmarks don't 404.
          { path: "ai-agent", element: <AiAgent /> },
          { path: "ai-agent/chat", element: <Navigate to="/ai-agent" replace /> },
          // /capstone shows the default track (api-dev) directly, no redirect;
          // /capstone/:trackId serves other tracks once they have a brief.
          { path: "capstone", element: <CapstonePage /> },
          // Static segment wins over ":trackId" in React Router's ranking.
          { path: "capstone/admin", element: <CapstoneAdminPage /> },
          { path: "capstone/:trackId", element: <CapstonePage /> },
          { path: "team", element: <TeamPage /> },
          { path: "team/admin", element: <TeamAdminPage /> },
          { path: "billing", element: <BillingPage /> },
          { path: "progress", element: <ProgressPage /> },
          { path: "voice-review", element: <VoiceReviewPage /> },
          { path: "users/:username", element: <UserProfile /> },
          {
            path: "my-profile",
            children: [
              { index: true, element: <MyProfile /> },
              { path: "settings", element: <Settings /> },
              { path: "followers", element: <Followers /> },
              { path: "following", element: <Followers /> },
              { path: "add-blog", element: <AddBlog /> },
              { path: "edit-blog/:id", element: <EditBlog /> },
              { path: "my-blogs", element: <MyBlogs /> },
              { path: "chats", element: <Chats /> },
              { path: "notifications", element: <Notifications /> },
              { path: "favourites", element: <Favorites /> },
              { path: "connected-accounts", element: <ConnectedAccounts /> },
              { path: "blocked", element: <BlockedUsers /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
export default router;
