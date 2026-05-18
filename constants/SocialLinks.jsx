import { FaGithub, FaLinkedin } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";

const SOCIAL_LINKS = [
  {
    key: "githubLink",
    label: "GitHub",
    icon: <FaGithub />,
    hover: "hover:text-gray-900 dark:hover:text-gray-100",
  },
  {
    key: "linkedinLink",
    label: "LinkedIn",
    icon: <FaLinkedin />,
    hover: "hover:text-blue-600 dark:hover:text-blue-400",
  },
  {
    key: "twitterLink",
    label: "Twitter / X",
    icon: <XIcon fontSize="inherit" />,
    hover: "hover:text-gray-900 dark:hover:text-gray-100",
  },
];

export default SOCIAL_LINKS;
