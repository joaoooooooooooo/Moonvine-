import { useMemo } from "react";
import {
  defaultSettingsPath,
  settingsNavItems,
} from "@/features/settings/config/settings-nav";

export function useSettingsSection(pathname) {
  return useMemo(() => {
    const normalizedPath =
      pathname && pathname.startsWith("#/settings")
        ? pathname
        : defaultSettingsPath;

    const activeSection =
      settingsNavItems.find((item) => item.url === normalizedPath) ??
      settingsNavItems[0];

    return {
      activeSection,
      items: settingsNavItems.map((item) => ({
        ...item,
        isActive: item.url === activeSection.url,
      })),
      normalizedPath,
    };
  }, [pathname]);
}
