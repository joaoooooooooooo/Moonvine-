import {
  AvatarMenuDropdown,
  AvatarMenuSearchCommand,
  ThemeSwitcherDropdown,
} from "@/components/navigation/avatar-menu";
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

const primaryItems = [
  { icon: BoltIcon, label: "Quick actions" },
  { icon: Layers2Icon, label: "Projects" },
  { icon: BookOpenIcon, label: "Documentation" },
];

const secondaryItems = [
  { icon: PinIcon, label: "Pinned items" },
  { icon: UserPenIcon, label: "Edit profile" },
];

export function AvatarMenuTestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3">
        <AvatarMenuSearchCommand />
        <ThemeSwitcherDropdown />
        <AvatarMenuDropdown
          email="keith.kennedy@moonvine.design"
          name="Keith Kennedy"
          primaryItems={primaryItems}
          secondaryItems={secondaryItems}
        />
      </div>
    </main>
  );
}
