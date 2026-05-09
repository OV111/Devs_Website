import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, Github, Mail } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";

const QuickLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy" },
];
const AuthLinks = [
  { title: "My Profile", href: "/my-profile" },
  { title: "Roadmaps", href: "/roadmaps" },
  { title: "Coding Libs", href: "/coding-libs" },
  { title: "Challenges", href: "/coding-challenges" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy" },
];

const Footer = () => {
  const { pathname } = useLocation();
  const { auth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <React.Fragment>
      {/* bg-linear-to-r from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-800 */}
      <footer className="relative z-1 px-5 pt-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-10">
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={null} width={0} height={0} alt="Logo" />
              <h1 className="text-3xl font-extrabold  tracking-wide text-[#F7F7F8]">
                DevsWebs
              </h1>
            </Link>
            <p className="mb-6 text-sm leading-6 text-[#A1A0AB] sm:text-base">
              DevsFlow is where developers learn, build, and grow — community
              content, structured roadmaps you have to earn, and a personal AI
              agent that knows exactly where you are in your journey.
            </p>

            {/* Social Links */}
            <div className="mb-2">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#F7F7F8]">
                Follow Us
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="https://github.com/OV111"
                  aria-label="Visit our GitHub"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition duration-200  hover:border-white/40 hover:bg-white/20"
                >
                  <Github
                    size={18}
                    className="text-[#A1A0AB] transition group-hover:text-white"
                  />
                </Link>
                <Link
                  to="/"
                  aria-label="Visit our X profile"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition duration-200  hover:border-white/40 hover:bg-white/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px] fill-[#A1A0AB] transition group-hover:fill-white"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  to="/"
                  aria-label="Send us an email"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:border-white/40 hover:bg-white/20"
                >
                  <Mail
                    size={18}
                    className="text-[#A1A0AB] transition group-hover:text-white"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold mb-2 text-[#F7F7F8]">
              Quick Links
            </h2>
            {(auth ? AuthLinks : QuickLinks).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base hover:text-purple-300 transition sm:text-lg ${
                  pathname === link.href ? "text-purple-400" : "text-[#A1A0AB]"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold mb-2 text-[#F7F7F8]">
              Categories
            </h2>
            {CATEGORY_OPTIONS.map(({ title, slug }) => (
              <Link
                key={slug}
                to={`/categories/${slug}`}
                className={`text-base hover:text-purple-300 transition sm:text-lg ${
                  pathname === `/categories/${slug}`
                    ? "text-purple-500"
                    : "text-[#A1A0AB]"
                }`}
              >
                {title}
              </Link>
            ))}
          </div>
          {/* Email Part */}
          <div className="flex flex-col gap-4 mt-5 lg:mt-0">
            <h2 className="text-2xl font-bold mb-0 text-[#F7F7F8]">
              Stay Updated!
            </h2>
            <p className="text-[#A1A0AB] mb-4 lg:mb-0">
              Subscribe to our newsletter for the latest articles and updates.
            </p>
            {subscribed ? (
              <p className="text-purple-200 text-sm">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 lg:h-10">
                <input
                  type="email"
                  placeholder="Enter Your Email."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-2 flex-grow rounded-md pl-2 outline-none bg-purple-700 border-purple-600 text-white placeholder-purple-300 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="p-2 bg-purple-600 cursor-pointer   hover:bg-purple-700 text-white  rounded-md shadow-sm transition-colors duration-200"
                >
                  <Send className="w-6 h-6 lg:mx-4 my-0 "></Send>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-7xl py-5 text-center text-sm text-[#A1A0AB] sm:text-base">
          © {new Date().getFullYear()} Devs Webs. All rights reserved!
        </div>
      </footer>
    </React.Fragment>
  );
};
export default Footer;
