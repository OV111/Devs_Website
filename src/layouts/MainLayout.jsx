import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LoadingSuspense from "../components/feedback/LoadingSuspense";
const MainLayout = () => {
  return (
    // [#000000] Good option for bg color
    <div className="relative bg-gray-950 min-h-screen overflow-x-hidden">
      {/* Global background decorations — shared across all pages */}
      <div className="pointer-events-none fixed top-30 -left-20 h-72 w-72 rounded-full bg-purple-900/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-100/60 blur-3xl dark:bg-purple-900/10" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<LoadingSuspense />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
