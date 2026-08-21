import { useEffect, useState } from "react";
import {
  BlocksIcon,
  BookOpenIcon,
  FingerprintIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  NetworkIcon,
  SatelliteDishIcon,
  SendIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { settingsNavItems } from "@/features/settings/config/settings-nav";

export type SidebarNavItem = {
	title: string;
	url: string;
	icon: React.ReactNode;
	isActive?: boolean;
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

const DEFAULT_PATH = "#/observatory";

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Console",
		items: [
			{
				title: "Observatory",
				url: "#/observatory",
				icon: (
					<LayoutGridIcon
					/>
				),
			},
			{
				title: "Accounts",
				url: "#/accounts",
				icon: (
					<NetworkIcon
					/>
				),
			},
			{
				title: "Reports",
				url: "#/reports",
				icon: (
					<SatelliteDishIcon
					/>
				),
			},
			{
				title: "Entities",
				url: "#/entities",
				icon: (
					<BlocksIcon
					/>
				),
			},
		],
	},
	{
		label: "Administration",
		items: [
			{
				title: "Settings",
				url: "#/settings/profile",
				icon: (
					<SettingsIcon
					/>
				),
			},
			{
				title: "People",
				url: "#/people",
				icon: (
					<UsersIcon
					/>
				),
			},
			{
				title: "Super Admin",
				url: "#/super-admin",
				icon: (
					<FingerprintIcon
					/>
				),
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Feedback",
		url: "#/feedback",
		icon: (
			<SendIcon data-icon="inline-start" />
		),
	},
	{
		title: "Help Center",
		url: "#/help",
		icon: (
			<HelpCircleIcon
			/>
		),
	},

	{
		title: "Documentation",
		url: "#/documentation",
		icon: (
			<BookOpenIcon
			/>
		),
	},
];

export function getCurrentConsolePath() {
  if (typeof window === "undefined") {
    return DEFAULT_PATH;
  }

  const hash = window.location.hash;
  return hash && hash.startsWith("#/") ? hash : DEFAULT_PATH;
}

export function useCurrentConsolePath() {
  const [path, setPath] = useState(getCurrentConsolePath);

  useEffect(() => {
    function handleHashChange() {
      setPath(getCurrentConsolePath());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return path;
}

export function getNavGroups(path: string): SidebarNavGroup[] {
  return navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive:
        item.url === path ||
        (item.url === "#/people" && path.startsWith("#/people/")),
    })),
  }));
}

export function getFooterNavLinks(path: string): SidebarNavItem[] {
  return footerNavLinks.map((item) => ({
    ...item,
    isActive: item.url === path,
  }));
}

export function getNavLinks(path: string): SidebarNavItem[] {
  return [...getNavGroups(path).flatMap((group) => group.items), ...getFooterNavLinks(path)];
}

export function getActiveNavItem(path: string) {
  if (path.startsWith("#/settings")) {
    return settingsNavItems.find((item) => item.url === path) ?? settingsNavItems[0];
  }

  if (path.startsWith("#/people/")) {
    return navGroups
      .flatMap((group) => group.items)
      .find((item) => item.url === "#/people");
  }

  return getNavLinks(path).find((item) => item.isActive) ?? null;
}
