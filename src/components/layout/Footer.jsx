import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { Send, Github, Twitter, Mail } from "lucide-react";
import { Send } from "lucide-react";                                                                             
      import GitHubIcon from "@mui/icons-material/GitHub";                                                             
      import XIcon from "@mui/icons-material/X";                                                                       
      import MailOutlineIcon from "@mui/icons-material/MailOutline";  

const QuickLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy" },
];
const Categories = [
  { title: "Full Stack", href: "/categories/fullstack" },
  { title: "Backend", href: "/categories/backend" },
  { title: "AI & ML", href: "/categories/ai&ml" },
  { title: "Mobile", href: "/categories/mobile" },
  { title: "Game Dev", href: "/categories/gamedev" },
  { title: "Quality Assurance", href: "/categories/qa" },
  { title: "DevOps", href: "/categories/devops" },
];

const Footer = () => {
  const { pathname } = useLocation();
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
      <footer className="relative z-1 bg-linear-to-r from-purple-600 to-purple-800 px-5 pt-10 text-white dark:from-purple-700 dark:to-purple-800 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-12">
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={null} width={0} height={0} alt="Logo" />
              <h1 className="text-3xl font-extrabold  tracking-wide">
                DevsWebs
              </h1>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-6 text-purple-200 sm:text-base">
              A blog dedicated to modern web development, AI trends, and quality
              assurance — insights, tutorials, and real-world guides for
              developers and tech enthusiasts.
            </p>

            {/* Social Links */}
            <div className="mb-2">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-purple-200/80">
                Follow Us
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="https://github.com/OV111"
                  aria-label="Visit our GitHub"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                >
                  <GitHubIcon
                    className="text-lg text-white/85 transition group-hover:text-white"
                    fontSize="medium"
                  />
                </Link>
                <Link
                  to="/"
                  aria-label="Visit our X profile"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                >
                  <XIcon
                    className="text-lg text-white/85 transition group-hover:text-white"
                    fontSize="medium"
                  />
                </Link>
                <Link
                  to="/"
                  aria-label="Send us an email"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                >
                  <MailOutlineIcon
                    className="text-lg text-white/85 transition group-hover:text-white"
                    fontSize="medium"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 sm:gap-10">
            <div className="grid gap-1">
              <h2 className="text-xl font-bold mb-2  text-purple-400">
                Quick Links
              </h2>
              {QuickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base hover:text-purple-300 transition sm:text-lg ${
                    pathname === link.href ? "text-purple-400" : "text-white"
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* Categories Part */}
            <div className="grid gap-1 space-y-0">
              <h2 className="text-xl font-bold mb-2  text-purple-400">
                Categories
              </h2>
              {Categories.map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  className={`text-base hover:text-purple-300 transition sm:text-lg ${
                    pathname === category.href
                      ? "text-purple-500"
                      : "text-white"
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
          {/* Email Part */}
          <div className="flex flex-col gap-4 mt-5 lg:mt-0 ">
            <h2 className="text-2xl font-bold mb-0 w-50 text-purple-400">
              Stay Updated!
            </h2>
            <p className="text-purple-200 mb-4 lg:mb-0 w-60">
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

        <div className="mx-auto mt-8 max-w-7xl py-8 text-center text-sm text-purple-300 sm:text-base">
          © {new Date().getFullYear()} Devs Webs. All rights reserved!
        </div>
      </footer>
    </React.Fragment>
  );
};
export default Footer;
