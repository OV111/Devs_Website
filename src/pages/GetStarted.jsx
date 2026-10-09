import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import { sanitizeInput } from "../utils/sanitize";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const inputBase =
  "min-h-11 w-full px-3.5 py-2.5 text-base sm:text-sm text-[#30313d] dark:text-white bg-white dark:bg-zinc-800 border rounded-md placeholder:text-[#a3acb9] dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/30 transition-all duration-150";
const inputNormal =
  "border-[#e0e0e0] dark:border-zinc-700 focus:border-fuchsia-500 dark:focus:border-fuchsia-400";
const inputError =
  "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30";
const labelClass =
  "block text-sm font-medium text-[#30313d] dark:text-zinc-300 mb-1.5";
const errorClass = "text-red-500 dark:text-red-400 text-sm sm:text-xs mt-1";
// Icon-only buttons need a 44px hit area even though the glyph stays 16px.
const eyeBtnClass =
  "absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[#a3acb9] dark:text-zinc-500 hover:text-[#697386] dark:hover:text-zinc-400 cursor-pointer transition-colors";

const GetStarted = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  // The URL owns the mode (?mode=login | signup) so the navbar's "Log in" /
  // "Start free" links switch the form even while this page is mounted.
  const [searchParams, setSearchParams] = useSearchParams();
  const isSignedUp = searchParams.get("mode") !== "login";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authUiMessage, setAuthUiMessage] = useState("");
  const googleBtnRef = useRef(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const generateUsername = (firstName = "", lastName = "") => {
    return (
      `${firstName}${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20) || "dev"
    );
  };

  const onSubmit = async (data) => {
    setAuthUiMessage("");
    setIsLoading(true);

    const url = isSignedUp
      ? `${API_BASE_URL}/get-started`
      : `${API_BASE_URL}/login`;

    const payload = isSignedUp
      ? {
          ...data,
          username: generateUsername(data.firstName, data.lastName),
        }
      : data;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.message}`, { duration: 900 });
        login(result.accessToken);
        reset();
        navigate("/");
      } else if (response.status === 409) {
        setAuthUiMessage(result.message);
        toast.error(result.message);
      } else if (response.status === 404) {
        setAuthUiMessage(result.message);
        toast.error(result.message);
      } else if (response.status === 401) {
        setAuthUiMessage(result.message);
        toast.error(result.message);
      } else if (response.status === 429) {
        setAuthUiMessage(
          result.message || "Too many attempts. Please try again later.",
        );
        toast.error(
          result.message || "Too many attempts. Please try again later.",
        );
      } else {
        setAuthUiMessage(result.message || "Request failed");
        toast.error(result.message || "Request failed");
      }
    } catch (err) {
      console.error(err);
      setAuthUiMessage("Server is unavailable. Please try again later.");
      toast.error("Server is unavailable. Please try again later!", {
        duration: 2500,
      });
    }

    setIsLoading(false);
  };

  const toggleLink = () => {
    setSearchParams({ mode: isSignedUp ? "login" : "signup" }, { replace: true });
    setAuthUiMessage("");
    reset();
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/google/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tokenId: credentialResponse.credential }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Google login successful");
        login(result.accessToken);
        navigate("/");
      } else {
        toast.error(result.message || "Google auth failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google auth failed");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-dvh flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[520px]">
          {/* Card */}
          <div className="bg-white dark:bg-neutral-800/60 dark:backdrop-blur-sm rounded-xl px-5 py-8 sm:px-8 sm:py-10">
            {/* Heading */}
            <h1 className="flex justify-center text-[22px] sm:text-[24px] font-semibold leading-tight text-[#1a1f36] dark:text-white mb-1">
              {isSignedUp ? "Create your account" : "Sign in to your account"}
            </h1>
            <p className="flex justify-center text-base sm:text-[13.5px] text-[#697386] dark:text-zinc-400 mb-7 text-center">
              {isSignedUp
                ? "Join Vahoha and start building today."
                : "Welcome back! Enter your details below."}
            </p>

            {/* Error banner */}
            {authUiMessage && (
              <div className="mb-5 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-base sm:text-sm text-red-600 dark:text-red-400">
                {authUiMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First & Last name — signup only */}
              {isSignedUp && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="firstName" className={labelClass}>First name</label>
                    <input
                      id="firstName"
                      autoComplete="given-name"
                      maxLength={50}
                      {...register("firstName", {
                        required: "First name is required.",
                        minLength: {
                          value: 2,
                          message: "At least 2 characters.",
                        },
                        maxLength: { value: 50, message: "Max 50 characters." },
                        pattern: {
                          value: /^[a-zA-Z\s'-]+$/,
                          message:
                            "Only letters, spaces, hyphens, apostrophes.",
                        },
                        setValueAs: (v) => sanitizeInput(v),
                      })}
                      placeholder="John"
                      className={`${inputBase} ${errors.firstName ? inputError : inputNormal}`}
                    />
                    {errors.firstName && (
                      <p className={errorClass}>{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="lastName" className={labelClass}>Last name</label>
                    <input
                      id="lastName"
                      autoComplete="family-name"
                      maxLength={50}
                      {...register("lastName", {
                        required: "Last name is required.",
                        minLength: {
                          value: 2,
                          message: "At least 2 characters.",
                        },
                        maxLength: { value: 50, message: "Max 50 characters." },
                        pattern: {
                          value: /^[a-zA-Z\s'-]+$/,
                          message:
                            "Only letters, spaces, hyphens, apostrophes.",
                        },
                        setValueAs: (v) => sanitizeInput(v),
                      })}
                      placeholder="Doe"
                      className={`${inputBase} ${errors.lastName ? inputError : inputNormal}`}
                    />
                    {errors.lastName && (
                      <p className={errorClass}>{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  {...register("email", {
                    required: "Email is required.",
                    maxLength: { value: 254, message: "Max 254 characters." },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                    setValueAs: (v) => sanitizeInput(v),
                  })}
                  placeholder="johndoe@example.com"
                  className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                />
                {errors.email && (
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-[#30313d] dark:text-zinc-300">
                    Password
                  </label>
                  {!isSignedUp && (
                    <Link
                      to="/forgot-password"
                      className="inline-flex min-h-11 items-center text-sm sm:text-[13px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignedUp ? "new-password" : "current-password"}
                    maxLength={72}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: isSignedUp
                        ? { value: 6, message: "At least 6 characters." }
                        : undefined,
                      maxLength: { value: 72, message: "Max 72 characters." },
                      // Symbol rule is signup-only: on login it would block
                      // existing passwords and leak the password policy.
                      pattern: isSignedUp
                        ? {
                            value: /[!@#$%^&*()]/,
                            message: "Must include at least one symbol (!@#$%^&*()).",
                          }
                        : undefined,
                    })}
                    placeholder="••••••••"
                    className={`${inputBase} pr-11 ${errors.password ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className={eyeBtnClass}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className={errorClass}>{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password — signup only */}
              {isSignedUp && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      maxLength={72}
                      {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        maxLength: { value: 72, message: "Max 72 characters." },
                        validate: (value) =>
                          value === getValues("password") ||
                          "Passwords don't match.",
                      })}
                      placeholder="••••••••"
                      className={`${inputBase} pr-11 ${errors.confirmPassword ? inputError : inputNormal}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className={eyeBtnClass}
                    >
                      {showConfirmPassword ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className={errorClass}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full min-h-11 mt-2 py-2.5 px-4 rounded-md text-base sm:text-sm font-semibold text-white transition-colors duration-150 ${
                  isLoading
                    ? "bg-purple-300 dark:bg-purple-950 cursor-not-allowed"
                    : "bg-[#7E57FF] hover:bg-[#7E57FF]/90 active:bg-[#7E57FF]/80 cursor-pointer"
                }`}
              >
                {isLoading
                  ? "Please wait…"
                  : isSignedUp
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            {/* OR divider */}
            <div className="flex items-center my-5">
              <div className="grow border-t border-[#e0e0e0] dark:border-zinc-700" />
              <span className="mx-3 text-[13px] text-[#697386] dark:text-zinc-500">
                or
              </span>
              <div className="grow border-t border-[#e0e0e0] dark:border-zinc-700" />
            </div>

            {/* Social buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Hidden real Google button */}
              <div ref={googleBtnRef} className="hidden">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google Sign-In failed")}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  googleBtnRef.current
                    ?.querySelector("div[role=button]")
                    ?.click()
                }
                className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-[#e0e0e0] dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2.5 px-4 text-base sm:text-sm font-medium text-[#30313d] dark:text-zinc-200 transition hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                <FcGoogle size={18} />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `${API_BASE_URL}/auth/github`;
                }}
                className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-[#30363d] dark:border-zinc-700 bg-[#24292e] dark:bg-zinc-800 py-2.5 px-4 text-base sm:text-sm font-medium text-white dark:text-zinc-200 transition hover:bg-[#2f363d] dark:hover:bg-zinc-700"
              >
                <FaGithub size={18} />
                Continue with GitHub
              </button>
            </div>

            {/* Toggle */}
            <p className="mt-6 text-center text-base sm:text-[13.5px] text-[#697386] dark:text-zinc-400">
              {isSignedUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                onClick={toggleLink}
                className="min-h-11 px-1 text-fuchsia-600 dark:text-fuchsia-400 font-medium hover:underline cursor-pointer"
              >
                {isSignedUp ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GetStarted;
