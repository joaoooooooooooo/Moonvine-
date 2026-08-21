import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";

export function SettingsShell({ children, items }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <SettingsSidebar items={items} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
