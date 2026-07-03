import { BadgeCheck, CirclePlus, Database, FileStack, History, UserCheck } from "lucide-react";

export const projectRequestMenu = [
  {
    title: "New Request",
    url: "/ProjectRequest/NewRequest",
    icon: CirclePlus,
    prAdminRequired: false,
  },
  {
    title: "My Request",
    url: "/projectRequest/myRequest",
    icon: History,
    prAdminRequired: false,
  },
  {
    title: "All Request",
    url: "/projectRequest/allRequest",
    icon: FileStack,
    prAdminRequired: false,
  },
  {
    title: "Manage Data",
    url: "/projectRequest/manageData",
    icon: Database,
    prAdminRequired: true,
  },
];

export const systemConfigMenu = [
  {
    title: "Manage Permission",
    url: "/permission",
    icon: UserCheck
  },
  {
    title: "Manage Role",
    url: "/role",
    icon: BadgeCheck
  }
]