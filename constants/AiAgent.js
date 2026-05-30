import {
  Paperclip,
  Map,
  BarChart2,
  Target,
  FlaskConical,
  BookOpen,
  Zap,
  ClipboardList,
  Crosshair,
  FileText,
} from "lucide-react";

export const CHIPS = [
  { label: "Challenges", icon: Zap },
  { label: "Weak Spots", icon: Crosshair },
  { label: "Exams",      icon: ClipboardList },
  { label: "Blogs",      icon: FileText },
  { label: "Roadmap",    icon: Map },
];

export const DROPDOWN_ITEMS = [
  {
    items: [
      { icon: Paperclip,    label: "Attach file",       arrow: false },
    ],
  },
  {
    items: [
      { icon: Map,          label: "My roadmap",        arrow: true  },
      { icon: BarChart2,    label: "My progress",       arrow: true  },
      { icon: Target,       label: "My weak spots",     arrow: false },
    ],
  },
  {
    items: [
      { icon: FlaskConical, label: "Browse challenges", arrow: true  },
      { icon: BookOpen,     label: "Search blogs",      arrow: true  },
    ],
  },
];
