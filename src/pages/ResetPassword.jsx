import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { confirmPasswordReset } from "@/services/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:text-base border-gray-300 dark:border-zinc-700";

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="space-y-3">
          <p className="font-medium text-red-500">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-sm text-violet-600 hover:underline dark:text-violet-400">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match.");
    if (newPassword.length < 6) return toast.error("At least 6 characters.");
    setIsLoading(true);
    try {
      const res = await confirmPasswordReset(token, newPassword);
      const result = await res.json();
      if (res.ok) {
        toast.success("Password updated! Redirecting...");
        setTimeout(() => navigate("/get-started"), 1500);
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch {
      toast.error("Server unavailable. Try again later.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl rounded-2xl border border-violet-100 bg-white p-6 dark:border-zinc-800 dark:bg-gray-950 md:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-purple-700 dark:text-purple-600">
            Set new password
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            Choose a strong password for your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className={`${inputBase} pr-10 sm:pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-9 right-3 cursor-pointer text-gray-400 dark:text-zinc-500 sm:top-10 sm:right-5"
              >
                {showPassword ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
            <div className="relative">
              <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className={`${inputBase} pr-10 sm:pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute top-9 right-3 cursor-pointer text-gray-400 dark:text-zinc-500 sm:top-10 sm:right-5"
              >
                {showConfirm ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
              </button>
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
              {isLoading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
