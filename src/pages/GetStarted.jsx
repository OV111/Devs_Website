import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
// import Lottie from "lottie-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GetStarted = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authUiMessage, setAuthUiMessage] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const generateUsername = (firstName = "", lastName = "") => {
    const base = `${firstName}${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 16);
    const suffix = `${Date.now().toString().slice(-4)}${Math.floor(
      Math.random() * 100,
    )
      .toString()
      .padStart(2, "0")}`;

    return `${base || "dev"}_${suffix}`;
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
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(`${result.message}`, { duration: 900 });
        setTimeout(() => {
          navigate("/");
          login(result.token);
        }, 950);
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
          result.message || "Too many login attempts. Please try again later.",
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
    reset();
  };

  const toggleLink = () => {
    setIsSignedUp(!isSignedUp);
    setAuthUiMessage("");
    reset();
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/google/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: credentialResponse.credential }), // ← ID token JWT
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Google login successful");
        login(result.token);
        navigate("/");
      } else {
        toast.error(result.message || "Google auth failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google auth failed");
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse),
    onError: () => toast.error("Google Sign-In failed"),
    flow: "implicit", // or "implicit" depending on your backend
  });
  const googleBtnRef = React.useRef(null);
  return (
    <React.Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex min-h-screen">
        {/* Left Panel */}
        {/* <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-zinc-100 dark:bg-gray-950 px-12 py-16">
          <Lottie
            animationData={codingAnimation}
            loop
            className="w-full max-w-sm"
          />
          <ul className="mt-6 space-y-4 w-full max-w-sm">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl bg-purple-50 dark:bg-zinc-800/60 px-4 py-3"
              >
                <span className="text-purple-500 dark:text-purple-400">
                  {f.icon}
                </span>
                <span className="text-sm font-medium text-purple-700 dark:text-zinc-200">
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div> */}
        {/* Right Panel — Form */}
        <div className="flex min-h-screen w-full lg:w-1/2 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8">
          <div className="w-full max-w-xl rounded-2xl border border-violet-100 bg-white p-4  dark:border-zinc-800 dark:bg-gray-950  sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-purple-700 dark:text-purple-600">
              {isSignedUp ? "Get Started" : "Welcome Back"}
            </h2>
            {authUiMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {authUiMessage}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {isSignedUp && (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                        First Name
                      </label>
                      <input
                        placeholder="Enter Your First Name"
                        {...register("firstName", {
                          required: "First name is required.",
                        })}
                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none  dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:text-base ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300 dark:border-zinc-700"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                        Last Name
                      </label>
                      <input
                        placeholder="Enter Your Last Name"
                        {...register("lastName", {
                          required: "Last name is required.",
                        })}
                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:text-base ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-gray-300 dark:border-zinc-700"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                  Enter Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  {...register("email", { required: "Email is required." })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:text-base ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-zinc-700"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                  Enter Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter Your Password"
                  {...register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must contain at least 6 chars!",
                    },
                  })}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:pr-12 sm:text-base ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-zinc-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-9 right-3 cursor-pointer text-gray-400 dark:text-zinc-500 sm:top-10 sm:right-5"
                >
                  {showPassword ? (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isSignedUp && (
                <>
                  <div className="relative">
                    <label className="block mb-1 font-medium text-sm text-slate-700 dark:text-zinc-200 sm:text-base">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password!",
                        validate: (value) =>
                          value === getValues("password") ||
                          "Passwords don't match!",
                      })}
                      className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none  dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 sm:px-4 sm:pr-12 sm:text-base ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-zinc-700"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute top-9 right-3 cursor-pointer text-gray-400 dark:text-zinc-500 sm:top-10 sm:right-5"
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} className="sm:w-5 sm:h-5" />
                      ) : (
                        <EyeOff size={18} className="sm:w-5 sm:h-5" />
                      )}
                    </button>

                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="mt-4 w-full space-y-3 ">
                <div className="flex items-center">
                  <div className="grow border-t border-gray-300 dark:border-zinc-700" />
                  <span className="mx-3 text-sm text-gray-500">or</span>
                  <div className="grow border-t border-gray-300 dark:border-zinc-700" />
                </div>

                <div className="flex items-center justify-center gap-3 flex-wrap">
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
                    className="flex w-[246px] cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-[#dadce0] bg-white py-2.5 px-4 text-sm font-medium text-[#3c4043] transition hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.58-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${API_BASE_URL}/auth/github`;
                    }}
                    className="flex w-[246px] cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-[#30363d] bg-[#24292e] py-2.5 px-4 text-sm font-medium text-white transition hover:bg-[#2f363d] dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                    >
                      <path d="M12 .5C5.65.5.75 5.4.75 11.75c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.25.8-.55v-2c-3.2.7-3.9-1.5-3.9-1.5-.55-1.35-1.3-1.7-1.3-1.7-1.05-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.05 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.75-1.6-2.55-.3-5.25-1.25-5.25-5.6 0-1.25.45-2.25 1.2-3.05-.1-.3-.5-1.55.1-3.2 0 0 .95-.3 3.1 1.2.9-.25 1.85-.4 2.8-.4s1.9.15 2.8.4c2.15-1.5 3.1-1.2 3.1-1.2.6 1.65.2 2.9.1 3.2.75.8 1.2 1.8 1.2 3.05 0 4.35-2.7 5.3-5.3 5.6.45.4.85 1.1.85 2.25v3.35c0 .3.2.7.8.55 4.6-1.5 7.9-5.8 7.9-10.9C23.25 5.4 18.35.5 12 .5z" />
                    </svg>
                    Continue with GitHub
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`text-base sm:text-lg md:text-xl w-full mt-3 py-2 sm:py-2.5 rounded-lg mx-auto text-white font-bold transition-colors ${
                  isLoading
                    ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                    : "cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700"
                }`}
              >
                {isLoading ? "Loading..." : isSignedUp ? "Sign Up" : "Login"}
              </button>
            </form>

            <p
              onClick={toggleLink}
              className="mt-3 items-center cursor-pointer text-center text-sm text-blue-500 hover:underline dark:text-fuchsia-300 sm:mt-4 sm:text-base"
            >
              {isSignedUp
                ? "Already have an account? Login"
                : "Don't have an Account? Sign Up"}
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default GetStarted;
