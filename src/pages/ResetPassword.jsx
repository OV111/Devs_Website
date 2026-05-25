import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { confirmPasswordReset } from "@/services/authApi";

const inputBase =
  "w-full px-3.5 py-2.5 text-sm text-[#30313d] dark:text-white bg-white dark:bg-zinc-800 border rounded-md placeholder:text-[#a3acb9] dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/30 transition-all duration-150";
const inputNormal =
  "border-[#e0e0e0] dark:border-zinc-700 focus:border-fuchsia-500 dark:focus:border-fuchsia-400";
const labelClass =
  "block text-sm font-medium text-[#30313d] dark:text-zinc-300 mb-1.5";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="space-y-3">
          <p className="font-medium text-red-500">Invalid or missing reset token.</p>
          <Link
            to="/forgot-password"
            className="text-sm text-fuchsia-600 dark:text-fuchsia-400 hover:underline"
          >
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
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="dark:bg-zinc-900 rounded-xl px-8 py-10">

            <h1 className="text-[22px] sm:text-[24px] font-semibold leading-tight text-[#1a1f36] dark:text-white mb-1">
              Set new password
            </h1>
            <p className="text-[13.5px] text-[#697386] dark:text-zinc-400 mb-7">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className={`${inputBase} ${inputNormal} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3acb9] dark:text-zinc-500 hover:text-[#697386] dark:hover:text-zinc-400 cursor-pointer transition-colors"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className={`${inputBase} ${inputNormal} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3acb9] dark:text-zinc-500 hover:text-[#697386] dark:hover:text-zinc-400 cursor-pointer transition-colors"
                  >
                    {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
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
                {isLoading ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
