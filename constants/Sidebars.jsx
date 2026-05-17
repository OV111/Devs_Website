import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupOffOutlinedIcon from "@mui/icons-material/GroupOffOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LinkIcon from "@mui/icons-material/Link";

// Maybe change to lucide-icons
export const sidebarArr = [
  {
    section: "General",
    items: [
      {
        to: "/my-profile",
        icon: (
          <PersonOutlineIcon sx={{ fontSize: 22, color: "currentColor" }} />
        ),
        label: "Profile",
        end: true,
      },
      {
        to: "/my-profile/followers",
        activePaths: ["/my-profile/following"],
        icon: (
          <PeopleOutlineIcon sx={{ fontSize: 22, color: "currentColor" }} />
        ),
        label: "Followers",
      },
      {
        to: "/my-profile/notifications",
        icon: (
          <NotificationsNoneIcon sx={{ fontSize: 22, color: "currentColor" }} />
        ),
        label: "Notifications",
      },
    ],
  },
  {
    section: "Content",
    items: [
      {
        to: "/my-profile/add-blog",
        icon: <EditOutlinedIcon sx={{ fontSize: 22, color: "currentColor" }} />,
        label: "Add Blog",
      },
      {
        to: "/my-profile/chats",
        icon: <ChatOutlinedIcon sx={{ fontSize: 22, color: "currentColor" }} />,
        label: "Chats",
      },
      {
        to: "/my-profile/favourites",
        icon: (
          <BookmarkBorderOutlinedIcon
            sx={{ fontSize: 22, color: "currentColor" }}
          />
        ),
        label: "Favourites",
      },
    ],
  },
  {
    section: "Privacy",
    items: [
      {
        to: "/my-profile/connected-accounts",
        icon: <LinkIcon sx={{ fontSize: 22, color: "currentColor" }} />,
        label: "Connected Accounts",
      },
      {
        to: "/",
        icon: (
          <GroupOffOutlinedIcon sx={{ fontSize: 22, color: "currentColor" }} />
        ),
        label: "Blocked Users",
      },
    ],
  },
  {
    section: "Security",
    items: [
      {
        to: "/my-profile/settings",
        icon: (
          <SettingsOutlinedIcon sx={{ fontSize: 22, color: "currentColor" }} />
        ),
        label: "Settings",
      },
    ],
  },
];
