import { useState, useEffect, useRef, Suspense } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, LogOut, Menu, X, Search } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import SearchResults from "../search/SearchResults";
import SearchBar from "../search/SearchBar";
import CatPawButton from "@/components/effects/CatPawButton";
import { isNavLinkActive } from "@/utils/navigation";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";
import {
  AVATAR_MENU_ITEMS,
  MOBILE_EXTRA_LINKS,
  NAV_LINKS_AUTH,
  NAV_LINKS_GUEST,
} from "../../../constants/Navbar";
import AvatarImage from "./navbar/AvatarImage";
import UserSummary from "./navbar/UserSummary";
import GuestActions from "./navbar/GuestActions";
import DropdownPanel from "./navbar/DropdownPanel";
import Wordmark from "@/components/ui/Wordmark";

const HIDE_SEARCH_ROUTES = new Set(["/get-started", "/forgot-password", "/reset-password"]);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400";

const MobileNavLink = ({ to, children, className = "" }) => (
  <li className="text-base font-medium transition hover:text-purple-300">
    {/* py-2.5 gives a ~44px touch target (WCAG 2.5.5 / Apple HIG minimum). */}
    <NavLink to={to} className={`block py-2.5 ${className}`}>
      {children}
    </NavLink>
  </li>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { auth, logout } = useAuthStore();

  // One name at a time: "categories" | "avatar" | "search" | null.
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const navRef = useRef(null);

  const navLinks = auth ? NAV_LINKS_AUTH : NAV_LINKS_GUEST;
  const showSearch = !HIDE_SEARCH_ROUTES.has(pathname);
  const isCategoryActive = pathname.startsWith("/categories");

  // Hover already opened the menu for mouse users, so a mouse click must not
  // toggle it shut again. Keyboard activation (e.detail === 0 — no pointer
  // clicks) toggles; pointer clicks only open (that's also how touch opens it).
  const handleTriggerClick = (name) => (e) =>
    setOpenDropdown((current) => (e.detail === 0 && current === name ? null : name));
  const closeDropdown = () => setOpenDropdown(null);

  // Every navigation (and every login/logout) closes all menus and clears the
  // search. Keyed on location.key, not pathname, so clicking a link to the page
  // you're already on still closes the mobile menu. This replaces an
  // onClick={close} on every single link.
  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileOpen(false);
    setShowMobileCategories(false);
    setSearchValue("");
  }, [location.key, auth]);

  // Escape closes whichever menu is open.
  useEffect(() => {
    if (!isMobileOpen && !openDropdown) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setIsMobileOpen(false);
      setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileOpen, openDropdown]);

  // Lock page scroll behind the open mobile menu, otherwise swiping the
  // menu scrolls the page underneath it.
  useEffect(() => {
    if (!isMobileOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isMobileOpen]);

  // --navbar-h drives every "sit right below the navbar" layout (the Arena's
  // fixed panel, its mobile overlay, sticky toolbars). A one-shot read on
  // mount goes stale the moment the navbar's real height changes — a
  // dropdown opening, the mobile menu, a font swap — so keep it live instead.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--navbar-h", `${el.offsetHeight}px`);
    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/get-started");
  };

  const handleSearchSelect = (item) => {
    if (item.type === "user") navigate(`/users/${item.username}`);
    else if (item.type === "post") navigate(`/?search=${encodeURIComponent(item.title)}`);
    else if (item.type === "category") navigate(`/categories/${item.slug}`);
  };

  const searchResults = (props) => (
    <Suspense fallback={null}>
      <SearchResults query={searchValue} onSelect={handleSearchSelect} {...props} />
    </Suspense>
  );

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 flex w-full items-center bg-black px-4 py-2 text-white backdrop-blur-md lg:px-6"
    >
      {/* Left: logo */}
      <div className="flex-1">
        <Wordmark
          className="text-xl leading-6 text-[#E6E6E6] md:text-[21px] transition-transform duration-200 hover:opacity-100 hover:scale-[1.03]"
        />
      </div>

      {/* Center: nav links (desktop) */}
      <ul className="hidden items-center gap-0.5 text-sm font-medium text-gray-100 md:flex">
        {/* Hover opens it for mouse users; the click toggle is what makes it
            reachable by keyboard and touch. */}
        <li
          className="relative px-1 py-1"
          onMouseEnter={() => setOpenDropdown("categories")}
          onMouseLeave={closeDropdown}
        >
          <button
            onClick={handleTriggerClick("categories")}
            aria-haspopup="menu"
            aria-expanded={openDropdown === "categories"}
            aria-controls="categories-dropdown"
            className={`flex cursor-pointer items-center gap-1 rounded transition ${focusRing} ${
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
          <DropdownPanel
            open={openDropdown === "categories"}
            id="categories-dropdown"
            className="left-0 w-44"
          >
            <ul>
              {CATEGORY_OPTIONS.map(({ title, slug }) => (
                <li key={slug}>
                  <NavLink
                    to={`/categories/${slug}`}
                    className={({ isActive }) =>
                      `flex px-4 py-2 text-sm transition-colors ${
                        isActive ? "text-purple-500" : "text-gray-200 hover:text-purple-500"
                      }`
                    }
                  >
                    {title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </DropdownPanel>
        </li>

        {navLinks.map(({ label, to }) => (
          <li key={to} className="px-1 py-1 transition hover:text-purple-500">
            <NavLink
              to={to}
              className={({ isActive }) =>
                isNavLinkActive(to, location, isActive) ? "text-purple-500" : ""
              }
            >
              {label}
            </NavLink>
          </li>
        ))}

        {auth && (
          <li className="px-1">
            <CatPawButton
              className={({ isActive }) => (isActive ? "text-emerald-500" : "text-cyan-500/80")}
            />
          </li>
        )}
      </ul>

      {/* Right: search, avatar / guest actions (desktop), hamburger (mobile) */}
      <div className="flex flex-1 items-center justify-end gap-1">
        {showSearch && (
          <div
            ref={searchRef}
            className="relative hidden items-center gap-2 md:flex"
            onMouseEnter={() => setOpenDropdown("search")}
            onMouseLeave={() => !searchValue && closeDropdown()}
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
                  <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search…" />
                  {searchResults({ boundaryRef: searchRef })}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleTriggerClick("search")}
              aria-label="Open search"
              aria-expanded={openDropdown === "search"}
              aria-controls="search-results"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${focusRing} ${
                openDropdown === "search"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Search size={16} />
            </button>
          </div>
        )}

        {auth ? (
          <div
            className="relative ml-1 hidden md:block"
            onMouseEnter={() => setOpenDropdown("avatar")}
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={handleTriggerClick("avatar")}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={openDropdown === "avatar"}
              aria-controls="avatar-dropdown"
              className={`flex cursor-pointer items-center rounded-full ${focusRing}`}
            >
              <AvatarImage />
            </button>

            <DropdownPanel open={openDropdown === "avatar"} id="avatar-dropdown" className="right-0 w-52">
              <UserSummary inDropdown className="border-b border-white/10 px-4 py-2" />
              {AVATAR_MENU_ITEMS.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      isActive ? "font-medium text-purple-500" : "text-gray-200 hover:text-purple-500"
                    }`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 border-t border-white/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut size={15} />
                Logout
              </button>
            </DropdownPanel>
          </div>
        ) : (
          <GuestActions showBadge className="ml-2 hidden md:flex" />
        )}

        <button
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 md:hidden ${focusRing}`}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            style={{ top: "var(--navbar-h)" }}
            onClick={() => setIsMobileOpen(false)}
          />

          <ul
            id="mobile-menu"
            // Capped to the viewport and scrollable, so an expanded Categories
            // list on a short phone can't push links off-screen.
            className="absolute top-full left-0 z-50 flex max-h-[calc(100dvh-var(--navbar-h))] w-full flex-col overflow-y-auto overscroll-contain rounded-b-2xl border-y border-white/10 bg-black px-4 pt-3 pb-5 text-gray-100 shadow-xl md:hidden"
          >
            {showSearch && (
              <li className="relative mb-1">
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  onSubmit={() => setIsMobileOpen(false)}
                  placeholder="Search posts..."
                />
                {searchResults()}
              </li>
            )}

            <MobileNavLink to="/">Home</MobileNavLink>

            <li className="text-base font-medium">
              <button
                onClick={() => setShowMobileCategories((open) => !open)}
                aria-expanded={showMobileCategories}
                className="flex w-full cursor-pointer items-center gap-1 py-2.5 transition hover:text-purple-300"
              >
                Categories
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${showMobileCategories ? "rotate-180" : ""}`}
                />
              </button>
              {showMobileCategories && (
                <ul className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/20 pl-3">
                  {CATEGORY_OPTIONS.map(({ title, slug }) => (
                    <li key={slug}>
                      <NavLink
                        to={`/categories/${slug}`}
                        className={({ isActive }) =>
                          `flex min-h-11 items-center text-base transition ${isActive ? "text-purple-400" : "text-purple-100 hover:text-white"}`
                        }
                      >
                        {title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Same source as the desktop links, so the two can't drift apart. */}
            {navLinks.map(({ label, to }) => (
              <MobileNavLink key={to} to={to}>
                {label}
              </MobileNavLink>
            ))}

            {auth ? (
              <>
                <li className="text-base font-medium">
                  <CatPawButton />
                </li>
                {MOBILE_EXTRA_LINKS.map(({ label, to }) => (
                  <MobileNavLink key={to} to={to}>
                    {label}
                  </MobileNavLink>
                ))}

                <li className="mt-2 border-t border-white/20 pt-3">
                  <UserSummary />
                </li>
                {AVATAR_MENU_ITEMS.map(({ label, to, icon: Icon }) => (
                  <MobileNavLink key={to} to={to} className="flex items-center gap-2">
                    <Icon size={14} />
                    {label}
                  </MobileNavLink>
                ))}

                <li className="mt-1 border-t border-white/20 pt-3">
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2 py-2.5 text-base font-medium text-red-300 transition hover:text-red-200"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-3 border-t border-white/20 pt-4">
                <GuestActions fullWidth />
              </li>
            )}
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;
