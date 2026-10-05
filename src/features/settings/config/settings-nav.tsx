import {
  Link2Icon,
  SendIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  UsersIcon,
} from "@/components/ui/icons";

export const settingsNavItems = [
  {
    icon: <UserRoundIcon />,
    title: "Profile",
    url: "#/settings/profile",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Sign-in connections",
    url: "#/settings/sign-in-connections",
  },
  {
    icon: <UsersIcon />,
    title: "Team Access",
    url: "#/settings/team-access",
  },
  {
    icon: <Link2Icon />,
    title: "Source connections",
    url: "#/settings/source-connections",
  },
  {
    icon: <SendIcon />,
    title: "Report distribution",
    url: "#/settings/report-distribution",
  },
];

export const defaultSettingsPath = "#/settings/profile";
