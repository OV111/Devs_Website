import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { requestPasswordReset } from "@/services/authApi";

const inputBase =
  "w-full px-3.5 py-2.5 text-sm text-[#30313d] dark:text-white bg-white dark:bg-zinc-800 border rounded-md placeholder:text-[#a3acb9] dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/30 transition-all duration-150";
const inputNormal =
  "border-[#e0e0e0] dark:border-zinc-700 focus:border-fuchsia-500 dark:focus:border-fuchsia-400";

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

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="dark:bg-zinc-900 rounded-xl px-8 py-10">

            {sent ? (
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/40">
                  <svg
                    className="h-7 w-7 text-fuchsia-500"
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
                <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1a1f36] dark:text-white">
                  Check your email
                </h2>
                <p className="text-[13.5px] text-[#697386] dark:text-zinc-400 max-w-xs">
                  If{" "}
                  <span className="font-medium text-[#30313d] dark:text-zinc-200">
                    {email}
                  </span>{" "}
                  is registered, you'll receive a reset link shortly.
                </p>
                <Link
                  to="/get-started"
                  className="text-sm text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-medium"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-[22px] sm:text-[24px] font-semibold leading-tight text-[#1a1f36] dark:text-white mb-1">
                  Forgot your password?
                </h1>
                <p className="text-[13.5px] text-[#697386] dark:text-zinc-400 mb-7">
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#30313d] dark:text-zinc-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${inputBase} ${inputNormal}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white transition-colors duration-150 ${
                      isLoading
                        ? "bg-fuchsia-300 dark:bg-fuchsia-950 cursor-not-allowed"
                        : "bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 cursor-pointer"
                    }`}
                  >
                    {isLoading ? "Sending…" : "Send reset link"}
                  </button>
                </form>

                <p className="mt-6 text-center text-[13.5px] text-[#697386] dark:text-zinc-400">
                  Remember your password?{" "}
                  <Link
                    to="/get-started"
                    className="text-fuchsia-600 dark:text-fuchsia-400 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
