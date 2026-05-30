import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LoadingSuspense from "../components/feedback/LoadingSuspense";
const MainLayout = () => {
  return (
    // [#000000] Good option for bg color
    <div className="bg-gray-950 min-h-screen">
      <Navbar />
      {/* fix: suspense boundary here so lazy-route navigations show spinner instead of blank */}
      <main className="min-h-screen bg-gray-950">
        <Suspense fallback={<LoadingSuspense />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
