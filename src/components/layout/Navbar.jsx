import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useThemeStore from "../../stores/useThemeStore";
import SearchBar from "../search/SearchBar";
import { ChevronDown, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";
import {
  AVATAR_MENU_ITEMS,
  MOBILE_EXTRA_LINKS,
} from "../../../constants/Navbar";
import useProfileStore from "@/stores/useProfileStore";
const SearchResults = lazy(() => import("../search/SearchResults"));

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { auth, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { user, stats, fetchProfile, clearProfile } = useProfileStore();
  const showSearch = pathname !== "/";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!auth) {
      clearProfile();
      return;
    }
    fetchProfile();
  }, [auth]);

  // Single click-outside handler for both dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdown = () => setShowDropdown(false);

  const closeDropdownMobile = () => {
    setShowDropdownMobile(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/get-started");
    setAvatarMenuOpen(false);
    setIsOpen(false);
  };

  const handleSearchSubmit = (query) => {
    const trimmedQuery = query.trim();
    navigate(
      trimmedQuery ? `/?search=${encodeURIComponent(trimmedQuery)}` : "/",
    );
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
    <ul className="absolute top-full mt-0 left-0 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-0 z-4">
      {CATEGORY_OPTIONS.map(({ title, slug }) => (
        <li key={slug}>
          <NavLink
            to={`/categories/${slug}`}
            onClick={onClose}
            className="flex items-center px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {title}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    // bg-linear-to-r from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-800

    <nav className="sticky space-x-1 flex items-center justify-between px-3 gap-10 py-1  z-3 w-full   lg:gap-10 lg:py-2">
      <h2 className="text-base font-bold my-1 lg:my-0.5 cursor-pointer sm:text-xl text-gray-100 md:text-xl lg:text-xl lg:w-auto lg:ml-3">
        <NavLink to="/">DevsWebs</NavLink>
      </h2>

      {showSearch && (
        <div
          ref={desktopSearchRef}
          className="relative hidden flex-1 justify-end text-purple-600 md:flex"
        >
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearchSubmit}
            placeholder="Search"
          />
          <Suspense fallback={null}>
            <SearchResults
              query={searchValue}
              onSelect={handleSearchSelect}
              boundaryRef={desktopSearchRef}
            />
          </Suspense>
        </div>
      )}

      <ul className="flex items-center gap-1 text-gray-100 my-2 lg:my-0.5">
        {/* Home */}
        <li className="hidden md:block font-medium text-sm lg:text-sm px-1 py-1 hover:text-purple-300 transition">
          <NavLink to="/">Home</NavLink>
        </li>

        {/* Categories — desktop */}
        <li
          className="relative hidden md:block text-sm lg:text-sm font-medium px-1 py-1 hover:text-purple-300 transition-all duration-200 ease-out"
          ref={dropdownRef}
          onMouseLeave={() => {
            setShowDropdown(false);
          }}
          onMouseEnter={() => {
            setShowDropdown(true);
          }}
        >
          <button className="flex lg:gap-1 justify-center items-center cursor-pointer transition-all duration-200">
            Categories
          </button>
          {showDropdown && <CategoryList onClose={closeDropdown} />}
        </li>

        {auth ? (
          <>
            <li className="hidden md:block font-medium text-sm lg:text-base px-1 hover:text-purple-300 transition">
              <NavLink to="roadmaps">Roadmaps</NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-base px-1 hover:text-purple-300 transition">
              <NavLink to="coding-libs">Coding Libs</NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-base px-1 hover:text-purple-300 transition">
              <NavLink to="coding-challenges">Challenges</NavLink>
            </li>

            {/* Avatar dropdown — desktop */}
            <li
              className="relative hidden md:block flex items-center px-1"
              ref={avatarRef}
              onMouseLeave={() => {
                setAvatarMenuOpen(false);
              }}
              onMouseEnter={() => {
                setAvatarMenuOpen(true);
              }}
            >
              <button className="flex items-center cursor-pointer  transition-all duration-200 ease-out">
                <AvatarImage />
              </button>

              {avatarMenuOpen && (
                <div className="absolute right-0 top-full mt-0 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-0 z-4">
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <AvatarImage inDropdown />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.username && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{user.username}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Menu items */}
                  {AVATAR_MENU_ITEMS.map(({ label, to, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <Icon size={15} />
                      {label}
                    </NavLink>
                  ))}

                  <div className="border-t border-gray-100 dark:border-gray-700 my-0" />

                  {/* Theme toggle */}
                  {/* <div className="flex items-center justify-between px-4 py-2">
                    <span className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                      {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
                      {theme === "dark" ? "Dark mode" : "Light mode"}
                    </span>
                    <button
                      onClick={setTheme}
                      className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
                    >
                      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                    </button>
                  </div> */}

                  {/* <div className="border-t border-gray-100 dark:border-gray-700 my-1" /> */}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm rounded-b-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="hidden md:block font-medium text-sm lg:text-base px-1 py-1 hover:text-purple-300 transition">
              <NavLink to="about">About</NavLink>
            </li>
            <li className="hidden md:block font-medium text-sm lg:text-base px-1 py-1 hover:text-purple-300 transition">
              <NavLink to="get-started">Get Started</NavLink>
            </li>
          </>
        )}

        {/* Theme toggle — guests only on desktop */}
        {/* {!auth && <li className="hidden md:block">
          <button
            onClick={setTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex justify-center items-center cursor-pointer hover:text-purple-300 transition"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </li>} */}

        {/* Hamburger */}
        <li className="list-none">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden mb-1"
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </li>

        {/* Mobile menu */}
        {isOpen && (
          <ul className="flex flex-col gap-2 p-4 border-t-[0.1px] border-gray-100 absolute top-full left-0 w-full bg-linear-to-r from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-800 md:hidden z-4">
            {showSearch && (
              <li>
                <div ref={mobileSearchRef} className="relative">
                  <SearchBar
                    value={searchValue}
                    onChange={setSearchValue}
                    onSubmit={handleSearchSubmit}
                    placeholder="Search posts..."
                    className="max-w-full"
                  />
                  <Suspense fallback={null}>
                    <SearchResults
                      query={searchValue}
                      onSelect={handleSearchSelect}
                      boundaryRef={mobileSearchRef}
                    />
                  </Suspense>
                </div>
              </li>
            )}

            <MobileNavLink to="/">Home</MobileNavLink>

            {/* Categories — mobile */}
            <li className="relative text-base font-medium hover:text-purple-300 transition">
              <button
                onClick={() => setShowDropdownMobile(!showDropdownMobile)}
                className="flex items-center cursor-pointer"
              >
                Categories <ChevronDown size={16} className="inline" />
              </button>
              {showDropdownMobile && (
                <CategoryList onClose={closeDropdownMobile} />
              )}
            </li>

            {auth && (
              <>
                <MobileNavLink to="roadmaps">Roadmaps</MobileNavLink>
                <MobileNavLink to="coding-libs">Coding Libs</MobileNavLink>
                <MobileNavLink to="coding-challenges">Challenges</MobileNavLink>

                {/* Extra links */}
                {MOBILE_EXTRA_LINKS.map(({ label, to }) => (
                  <MobileNavLink key={to} to={to}>
                    {label}
                  </MobileNavLink>
                ))}

                {/* Avatar row */}
                <li className="flex items-center gap-3 pt-2 mt-1 border-t border-white/20">
                  <AvatarImage />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.firstName}
                    </p>
                    {user?.username && (
                      <p className="text-xs text-purple-200 truncate">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </li>

                {/* Profile links */}
                {AVATAR_MENU_ITEMS.map(({ label, to, icon: Icon }) => (
                  <MobileNavLink
                    key={to}
                    to={to}
                    className="flex items-center gap-2"
                  >
                    <Icon size={14} />
                    {label}
                  </MobileNavLink>
                ))}

                {/* Logout */}
                <li className="border-t border-white/20 pt-2">
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

            {/* Theme toggle — always at bottom of mobile menu */}
            <li className="flex items-center gap-2 border-t border-white/20 pt-2 mt-1">
              <button
                onClick={setTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="flex items-center gap-2 text-base font-medium cursor-pointer hover:text-purple-300 transition"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </button>
            </li>
          </ul>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
