import {
  User,
  Settings as SettingsIcon,
  Bell,
  Bookmark,
  TrendingUp,
  CreditCard,
} from "lucide-react";

export const AVATAR_MENU_ITEMS = [
  { label: "My Profile", to: "my-profile", icon: User },
  { label: "My Progress", to: "progress", icon: TrendingUp },
  { label: "Billing", to: "billing", icon: CreditCard },
  { label: "Notifications", to: "my-profile/notifications", icon: Bell },
  { label: "Favourites", to: "my-profile/favourites", icon: Bookmark },
  { label: "Settings", to: "my-profile/settings", icon: SettingsIcon },
];

export const NAV_LINKS_AUTH = [
  { label: "Roadmaps", to: "roadmaps" },
  { label: "Code Library", to: "libs" },
  { label: "Challenges", to: "coding-challenges" },
  { label: "Capstone", to: "capstone" },
];

// Guests only get public pages — a link behind ProtectedLayout would bounce
// them to the login wall on their first click.
export const NAV_LINKS_GUEST = [
  { label: "Roadmaps", to: "roadmaps" },
  { label: "Pricing", to: "pricing" },
  { label: "About", to: "about" },
];

export const MOBILE_EXTRA_LINKS = [
  { label: "About", to: "about" },
  { label: "Privacy", to: "privacy" },
];

export const LIBS_OPTIONS = [
    { title: "Books", slug: "books" },
    { title: "Documents", slug: "docs" },
    { title: "Guides", slug: "guides" },
    { title: "Sheets", slug: "sheets" },
  ];
