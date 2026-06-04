import React, { useState, useEffect, useRef, Suspense } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import useAuthStore from "../../stores/useAuthStore";
import SearchResults from "../search/SearchResults";
import SearchBar from "../search/SearchBar";
import { ChevronDown, LogOut, Menu, X, Search } from "lucide-react";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";
import {
  AVATAR_MENU_ITEMS,
  MOBILE_EXTRA_LINKS,
} from "../../../constants/Navbar";
import useProfileStore from "@/stores/useProfileStore";
import GradientText from "@/components/effects/GradientText";

const Navbar = () => {
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const openMenu = (name) => setOpenDropdown(name);
  const closeMenu = () => setOpenDropdown(null);

  const [searchValue, setSearchValue] = useState("");
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const { pathname } = useLocation();
  const { auth, logout } = useAuthStore();
  const { user, stats } = useProfileStore();

  const hideSearchRoutes = [
    "/get-started",
    "/forgot-password",
    "/reset-password",
  ];
  const showSearch = !hideSearchRoutes.includes(pathname);

  const isCategoryActive = pathname.startsWith("/categories");

  useEffect(() => {
    setOpenDropdown(null);
  }, [auth]);

  useEffect(() => {
    setSearchValue("");
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const closeDropdownMobile = () => {
    setShowDropdownMobile(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/get-started");
    setIsOpen(false);
  };

  const handleSearchSubmit = () => {
    setIsOpen(false);
  };

  const handleSearchSelect = (item) => {
    if (item.type === "user") navigate(`/users/${item.username}`);
    else if (item.type === "post")
      navigate(`/?search=${encodeURIComponent(item.title)}`);
    else if (item.type === "category") navigate(`/categories/${item.slug}`);
    setSearchValue("");
    setIsOpen(false);
  };

  const MobileNavLink = ({ to, children, className }) => (
    <li className="font-medium text-base hover:text-purple-300 transition">
      <NavLink to={to} onClick={() => setIsOpen(false)} className={className}>
        {children}
      </NavLink>
    </li>
  );

  const AvatarImage = ({ inDropdown = false }) => (
    <div
      className={`w-7 h-7 my-1 rounded-full shrink-0 border overflow-hidden flex justify-center items-center ${
        inDropdown ? "border-gray-200 dark:border-gray-600" : "border-white/50"
      }`}
    >
      {stats?.profileImage ? (
        <img
          src={stats.profileImage?.replace(
            "/upload/",
            "/upload/w_64,h_64,c_fill,f_auto,q_auto/",
          )}
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div
          className={`w-full h-full flex rounded-full items-center justify-center text-sm font-semibold ${
            inDropdown
              ? "bg-purple-100 dark:bg-purple-600 text-purple-700 dark:text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {user?.firstName?.[0]?.toUpperCase() || ""}
          {user?.lastName?.[0]?.toUpperCase() || ""}
        </div>
      )}
    </div>
  );

  const CategoryList = ({ onClose }) => (
    <AnimatePresence>
      <motion.ul
        initial={{ opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        id="categories-dropdown"
        className="absolute top-full mt-0 left-0 w-44 overflow-hidden rounded-md bg-white shadow-lg shadow-black/5 dark:bg-gray-900 dark:shadow-black/30 z-40"
      >
        {CATEGORY_OPTIONS.map(({ title, slug }) => (
          <li key={slug}>
            <NavLink
              to={`/categories/${slug}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                }`
              }
            >
              {title}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );

  return (
    <nav
      ref={(el) =>
        el &&
        document.documentElement.style.setProperty(
          "--navbar-h",
          el.offsetHeight + "px",
        )
      }
      className="sticky top-0 flex items-center px-4 lg:px-6 py-2 z-50 w-full bg-gray-950/80 backdrop-blur-md"
    >
      {/* Left: Logo */}
      <div className="flex-1">
        <h2 className="text-base font-bold cursor-pointer sm:text-xl md:text-xl lg:text-xl">
          <NavLink to="/" aria-label="DevsWebs - Go to homepage">
            <GradientText
              colors={["#a855f7", "#7c3aed", "#c084fc", "#7c3aed", "#a855f7"]}
              animationSpeed={6}
              className="font-bold text-base sm:text-xl"
            >
              DevsWebs
            </GradientText>
          </NavLink>
        </h2>
      </div>

      {/* Center: Nav links (desktop only) */}
      <ul className="hidden md:flex items-center gap-0.5 text-gray-100">
        <li
          className="relative hidden md:block text-sm lg:text-sm font-medium px-1 py-1 transition-all duration-200 ease-out"
          onMouseLeave={closeMenu}
          onMouseEnter={() => openMenu("categories")}
        >
          <button
            aria-label="Toggle categories menu"
            aria-haspopup="menu"
            aria-expanded={openDropdown === "categories"}
            aria-controls="categories-dropdown"
            className={`flex items-center gap-1 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
              isCategoryActive || openDropdown === "categories"
                ? "text-purple-500"
                : "hover:text-purple-500"
            }`}
          >
            Categories
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${openDropdown === "categories" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "categories" && (
            <CategoryList onClose={closeMenu} />
          )}
        </li>

        {auth ? (
          <>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 hover:text-purple-500 transition">
              <NavLink
                to="roadmaps"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Roadmaps
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 hover:text-purple-500 transition">
              <NavLink
                to="libs"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Coding Libs
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 hover:text-purple-500 transition">
              <NavLink
                to="coding-challenges"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Challenges
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 hover:text-purple-500 transition">
              <NavLink
                to="capstone"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Capstone
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 hover:text-cyan-300 transition">
              <NavLink
                to="ai-agent"
                className={({ isActive }) =>
                  isActive ? "text-emerald-500" : "text-cyan-500/80"
                }
              >
                AI-Agent
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 py-1 hover:text-purple-500 transition">
              <NavLink
                to="roadmaps"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Roadmaps
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 py-1 hover:text-purple-500 transition">
              <NavLink
                to="about"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                About
              </NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-sm px-1 py-1 hover:text-purple-500 transition">
              <NavLink
                to="get-started"
                className={({ isActive }) =>
                  isActive ? "text-purple-500" : ""
                }
              >
                Get Started
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Right: search + avatar (desktop) + hamburger (mobile) */}
      <div className="flex-1 flex items-center gap-1 justify-end">
        {/* Search — desktop */}
        {showSearch && (
          <div
            ref={searchRef}
            className="relative hidden items-center md:flex gap-2"
            onMouseEnter={() => openMenu("search")}
            onMouseLeave={() => { if (!searchValue) closeMenu(); }}
          >
            <AnimatePresence>
              {openDropdown === "search" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 220 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <SearchBar
                    value={searchValue}
                    onChange={setSearchValue}
                    onSubmit={handleSearchSubmit}
                    placeholder="Search…"
                  />
                  <Suspense fallback={null}>
                    <SearchResults
                      query={searchValue}
                      onSelect={handleSearchSelect}
                      boundaryRef={searchRef}
                    />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              aria-label="Open search"
              aria-expanded={openDropdown === "search"}
              aria-controls="search-results"
              className={`flex items-center justify-center w-8 h-8 rounded-full transition ${
                openDropdown === "search"
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Search size={16} />
            </button>
          </div>
        )}

        {/* Avatar — desktop */}
        {auth && (
          <div
            className="relative hidden md:block ml-1 mr-0"
            onMouseLeave={closeMenu}
            onMouseEnter={() => openMenu("avatar")}
          >
            <button
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={openDropdown === "avatar"}
              aria-controls="avatar-dropdown"
              className="flex items-center cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-full"
            >
              <AvatarImage />
            </button>

            <AnimatePresence>
              {openDropdown === "avatar" && (
                <motion.div
                  id="avatar-dropdown"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-0 w-52 overflow-hidden rounded-md bg-white shadow-lg shadow-black/5 dark:bg-gray-900 dark:shadow-black/30 z-40"
                >
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <AvatarImage inDropdown />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.username && (
                        <p
                          className="text-xs text-gray-500 dark:text-gray-400 truncate"
                          title={`@${user.username}`}
                        >
                          @{user.username}
                        </p>
                      )}
                    </div>
                  </div>

                  {AVATAR_MENU_ITEMS.map(({ label, to, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 transition"
                    >
                      {React.createElement(icon, { size: 15 })}
                      {label}
                    </NavLink>
                  ))}

                  <div className="border-t border-gray-100 dark:border-gray-700" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Hamburger — mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-1"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          style={{ top: "var(--navbar-h)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      {isOpen && (
        <ul className="flex flex-col gap-1 p-4 border-t border-white/10 absolute top-full left-0 w-full bg-gray-950 md:hidden z-50 shadow-xl text-gray-100">
          {showSearch && (
            <li className="mb-1">
              <div className="relative">
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  onSubmit={handleSearchSubmit}
                  placeholder="Search posts..."
                />
                <Suspense fallback={null}>
                  <SearchResults
                    query={searchValue}
                    onSelect={handleSearchSelect}
                  />
                </Suspense>
              </div>
            </li>
          )}

          <MobileNavLink to="/">Home</MobileNavLink>

          <li className="text-base font-medium hover:text-purple-300 transition">
            <button
              onClick={() => setShowDropdownMobile(!showDropdownMobile)}
              className="flex items-center gap-1 cursor-pointer w-full py-0.5"
            >
              Categories
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${showDropdownMobile ? "rotate-180" : ""}`}
              />
            </button>
            {showDropdownMobile && (
              <ul className="mt-1 ml-3 flex flex-col border-l border-white/20 pl-3 gap-0.5">
                {CATEGORY_OPTIONS.map(({ title, slug }) => (
                  <li key={slug}>
                    <NavLink
                      to={`/categories/${slug}`}
                      onClick={closeDropdownMobile}
                      className={({ isActive }) =>
                        `block py-1 text-sm transition ${isActive ? "text-purple-400" : "text-purple-100 hover:text-white"}`
                      }
                    >
                      {title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <MobileNavLink to="roadmaps">Roadmaps</MobileNavLink>

          {auth && (
            <>
              <MobileNavLink to="libs">Coding Libs</MobileNavLink>
              <MobileNavLink to="coding-challenges">Challenges</MobileNavLink>
              <MobileNavLink to="ai-agent">AI-Agent</MobileNavLink>
              <MobileNavLink to="capstone">Capstone</MobileNavLink>

              {MOBILE_EXTRA_LINKS.map(({ label, to }) => (
                <MobileNavLink key={to} to={to}>
                  {label}
                </MobileNavLink>
              ))}

              <li className="flex items-center gap-3 pt-3 mt-2 border-t border-white/20">
                <AvatarImage />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  {user?.username && (
                    <p
                      className="text-xs text-purple-200 truncate"
                      title={`@${user.username}`}
                    >
                      @{user.username}
                    </p>
                  )}
                </div>
              </li>

              {AVATAR_MENU_ITEMS.map(({ label, to, icon }) => (
                <MobileNavLink
                  key={to}
                  to={to}
                  className="flex items-center gap-2"
                >
                  {React.createElement(icon, { size: 14 })}
                  {label}
                </MobileNavLink>
              ))}

              <li className="border-t border-white/20 pt-3 mt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-base font-medium text-red-300 hover:text-red-200 transition cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </li>
            </>
          )}

          {!auth && (
            <>
              <MobileNavLink to="about">About</MobileNavLink>
              <MobileNavLink to="get-started">Get Started</MobileNavLink>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
