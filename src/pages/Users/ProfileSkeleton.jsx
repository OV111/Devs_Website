import React from "react";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="max-w-6xl mx-auto animate-pulse">

      {/* Banner */}
      <div className="relative">
        <div className="w-full h-40 sm:h-56 bg-gray-200 dark:bg-gray-800" />
        <div className="absolute -bottom-10 sm:-bottom-13 left-5 sm:left-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-300 dark:bg-gray-700 border-3 border-white dark:border-gray-900" />
        </div>
      </div>

      {/* Profile header */}
      <div className="pt-16 sm:pt-20 px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-44 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          {/* Right */}
          <div className="flex flex-col items-start lg:items-end gap-5">
            <div className="flex gap-2.5">
              <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center space-y-1.5">
                  <div className="h-6 w-10 rounded bg-gray-200 dark:bg-gray-800 mx-auto" />
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex gap-6 px-5 sm:px-8 mt-2 pb-16">

        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Activity section header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          {/* Activity grid placeholder */}
          <div className="h-28 rounded-sm bg-gray-200 dark:bg-gray-800" />

          {/* Paths section header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-sm bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>

          {/* Capstones section header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-48 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-36 rounded-sm bg-gray-200 dark:bg-gray-800" />

          {/* Exams section header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-sm bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>

          {/* Posts section header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>
          {/* Post cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>

        {/* Right panel — xl only */}
        <div className="w-60 shrink-0 hidden xl:block">
          {/* Badges header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>

          {/* At a glance header */}
          <div className="mt-10 flex items-center gap-4 mb-4">
            <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
