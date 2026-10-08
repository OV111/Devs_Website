import { NavLink, useLocation } from "react-router-dom";
import { Github, Mail } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import { isNavLinkActive } from "@/utils/navigation";
import Divider from "@/components/ui/Divider";
import Wordmark from "@/components/ui/Wordmark";
import XLogo from "@/components/ui/XLogo";
import { SITE } from "../../../constants/site";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";

// Guests only get public routes — anything behind ProtectedLayout would bounce
// them to the login wall. Members get the core learning loop instead.
const PRODUCT_LINKS_GUEST = [
  { title: "Roadmaps", to: "/roadmaps" },
  { title: "How it works", to: "/#how-it-works" },
  { title: "Pricing", to: "/pricing" },
];
const PRODUCT_LINKS_AUTH = [
  { title: "Roadmaps", to: "/roadmaps" },
  { title: "Challenges", to: "/coding-challenges" },
  { title: "Capstone", to: "/capstone" },
  { title: "My Progress", to: "/progress" },
  { title: "Billing", to: "/billing" },
];
const COMPANY_LINKS = [
  { title: "About", to: "/about" },
  { title: "Contact", to: "/contact" },
  { title: "Privacy Policy", to: "/privacy" },
  { title: "Terms of Service", to: "/terms" },
];
const CATEGORY_LINKS = CATEGORY_OPTIONS.map(({ title, slug }) => ({
  title,
  to: `/categories/${slug}`,
}));

// Small, medium-weight headings (Stripe/Vercel/Linear style): the links are
// the content, the heading only labels the group.
const headingClass = "mb-2 text-sm font-medium text-[#F7F7F8] sm:mb-3";

const iconClass =
  "group flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 transition duration-200 hover:border-white/40 hover:bg-white/20";

const LinkColumn = ({
  title,
  links,
  className = "",
  twoColumns = false,
  mobileLimit = Infinity,
}) => {
  const location = useLocation();
  return (
    <nav
      aria-label={title}
      className={`flex flex-col gap-0 sm:gap-1 ${className}`}
    >
      <h2 className={headingClass}>{title}</h2>
      {/* Topics is long: two columns on phones keeps the footer short. */}
      <div
        className={
          twoColumns
            ? "grid grid-cols-2 gap-x-6 sm:flex sm:flex-col sm:gap-1"
            : "flex flex-col sm:gap-1"
        }
      >
        {links.map(({ title, to }, index) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `items-center py-1 text-sm transition hover:text-purple-500 sm:py-0 ${
                index >= mobileLimit ? "hidden sm:flex" : "flex"
              } ${
                isNavLinkActive(to, location, isActive)
                  ? "text-purple-500"
                  : "text-[#A1A0AB]"
              }`
            }
          >
            {title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

// Heading only for now — content to come.
const AiColumn = () => (
  <div className="hidden flex-col gap-1 sm:flex">
    <h2 className={headingClass}>In the AI era</h2>
  </div>
);

const Footer = () => {
  const { auth } = useAuthStore();

  return (
    <footer className="relative z-1 mt-16">
      {/* <Divider /> */}
      <div className="px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-10 lg:grid-cols-[1.8fr_1fr_1.3fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col items-start sm:col-span-4 lg:col-span-1">
            <Wordmark className="mb-4" />
            <p className="mb-6 max-w-sm text-sm leading-6 text-[#A1A0AB]">
              Learn, build, and grow as a developer.
            </p>

            <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[#F7F7F8] uppercase">
              Follow Us
            </p>
            <div className="flex items-center gap-3">
              {/* External: plain <a> + new tab. <Link> is for in-app routes. */}
              <a
                href={SITE.socials.x.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vahoha on X"
                className={iconClass}
              >
                <XLogo
                  size={15}
                  className="text-[#A1A0AB] transition group-hover:text-white"
                />
              </a>
              <a
                href={SITE.socials.github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vahoha on GitHub"
                className={iconClass}
              >
                <Github
                  size={16}
                  className="text-[#A1A0AB] transition group-hover:text-white"
                />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email Vahoha"
                className={iconClass}
              >
                <Mail
                  size={16}
                  className="text-[#A1A0AB] transition group-hover:text-white"
                />
              </a>
            </div>
          </div>

          <LinkColumn
            title="Product"
            links={auth ? PRODUCT_LINKS_AUTH : PRODUCT_LINKS_GUEST}
          />
          <AiColumn />
          <LinkColumn title="Company" links={COMPANY_LINKS} />
          <LinkColumn
            title="Topics"
            links={CATEGORY_LINKS}
            twoColumns
            mobileLimit={6}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <div className="mx-auto mt-8 max-w-7xl pt-5 sm:mt-12 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-sm text-[#A1A0AB]">
          © {new Date().getFullYear()} Vahoha. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
