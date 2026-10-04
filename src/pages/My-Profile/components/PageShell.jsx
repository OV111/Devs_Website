import { Toaster } from "react-hot-toast";
import SideBar from "./SideBar";

/**
 * Shared shell for the account pages: sidebar, page padding, and the
 * title / subtitle / actions header, so they all use the same spacing
 * and type scale (16 / 24 / 40px side padding; 20 → 24px semibold title).
 */
export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" />
      <SideBar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                aria-live="polite"
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}
