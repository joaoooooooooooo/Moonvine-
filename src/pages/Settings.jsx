import {
  defaultSettingsPath,
  settingsNavItems,
} from "@/features/settings/config/settings-nav";
import { useSettingsSection } from "@/features/settings/hooks/use-settings-section";
import { SettingsProfile } from "@/features/settings/pages/settings-profile";
import { SettingsReportDistribution } from "@/features/settings/pages/settings-report-distribution";
import { SettingsSignInConnections } from "@/features/settings/pages/settings-sign-in-connections";
import { SettingsSourceConnections } from "@/features/settings/pages/settings-source-connections";
import { SettingsTeamAccess } from "@/features/settings/pages/settings-team-access";
import {
  getCurrentConsolePath,
  useCurrentConsolePath,
} from "@/features/console/components/app-shared";

const settingsPageMap = {
  "#/settings/profile": SettingsProfile,
  "#/settings/report-distribution": SettingsReportDistribution,
  "#/settings/sign-in-connections": SettingsSignInConnections,
  "#/settings/source-connections": SettingsSourceConnections,
  "#/settings/team-access": SettingsTeamAccess,
};

if (typeof window !== "undefined") {
  const currentPath = getCurrentConsolePath();
  const isSettingsPath = settingsNavItems.some((item) => item.url === currentPath);

  if (currentPath === "#/settings") {
    window.history.replaceState(null, "", defaultSettingsPath);
  } else if (currentPath.startsWith("#/settings") && !isSettingsPath) {
    window.history.replaceState(null, "", defaultSettingsPath);
  }
}

export function Settings() {
  const currentPath = useCurrentConsolePath();
  const { normalizedPath } = useSettingsSection(currentPath);
  const ActiveSectionComponent = settingsPageMap[normalizedPath] ?? SettingsProfile;

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <ActiveSectionComponent />
    </div>
  );
}
