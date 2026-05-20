import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { requestPasswordReset } from "@/services/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      const result = await res.json();
      if (res.ok) setSent(true);
      else toast.error(result.message);
    } catch {
      toast.error("Server Unavailable");
    }
    setIsLoading(false);
  };

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:text-base";

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 dark:border-zinc-800 dark:bg-gray-950 md:p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/40">
                <svg
                  className="h-7 w-7 text-violet-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                If{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {email}
                </span>{" "}
                is registered, you'll receive a reset link shortly.
              </p>
              <Link
                to="/get-started"
                className="text-sm text-blue-500 hover:underline dark:text-fuchsia-300"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-start mb-2 text-purple-700 dark:text-purple-600">
                Forgot password
              </h2>
              <p className="text-sm text-start text-gray-500 dark:text-gray-400 mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`${inputBase} border-gray-300 dark:border-zinc-700`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`text-base sm:text-lg w-full mt-2 py-2 sm:py-2.5 rounded-lg text-white font-bold transition-colors ${
                    isLoading
                      ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                      : "cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700"
                  }`}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              <p className="mt-3 text-center text-sm sm:mt-4">
                <Link
                  to="/get-started"
                  className="text-blue-500 hover:underline dark:text-fuchsia-300"
                >
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
