import {
  User,
  Settings as SettingsIcon,
  Bell,
  Bookmark,
} from "lucide-react";

export const AVATAR_MENU_ITEMS = [
  { label: "My Profile", to: "my-profile", icon: User },
  { label: "Notifications", to: "my-profile/notifications", icon: Bell },
  { label: "Favourites", to: "my-profile/favourites", icon: Bookmark },
  { label: "Settings", to: "my-profile/settings", icon: SettingsIcon },
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
