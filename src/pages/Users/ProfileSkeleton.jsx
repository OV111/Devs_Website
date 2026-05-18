import React from "react";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="relative">
        <div className="w-full h-52 sm:h-64 bg-gray-200 dark:bg-gray-800 rounded-b-3xl" />
        <div className="absolute -bottom-12 sm:-bottom-14 left-5 sm:left-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 dark:bg-gray-700 ring-4 ring-gray-50 dark:ring-gray-950" />
        </div>
      </div>

      <div className="pt-18 sm:pt-22 px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3.5 w-44 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex gap-2.5">
              <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex items-center gap-5">
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <div className="text-center space-y-1.5">
                    <div className="h-6 w-10 rounded bg-gray-200 dark:bg-gray-800 mx-auto" />
                    <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                  {i < 3 && (
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 h-px bg-gray-200 dark:bg-gray-800" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
