import {
  AvatarMenuDropdown,
  AvatarMenuSearchCommand,
  ThemeSwitcherDropdown,
} from "@/components/navigation/avatar-menu";
import { SideLineBackground } from "@/components/ui/line-background";
import logo from "@/assets/Logo Moonvine Light.svg";
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const primaryItems = [
  { icon: BoltIcon, label: "Quick actions" },
  { icon: Layers2Icon, label: "Projects" },
  { icon: BookOpenIcon, label: "Documentation" },
];

const secondaryItems = [
  { icon: PinIcon, label: "Pinned items" },
  { icon: UserPenIcon, label: "Edit profile" },
];

interface RootLayoutProps {
  children?: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SideLineBackground contentWidth="72rem" variant="medium" />
      <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-15 w-full max-w-[72rem] items-center justify-between px-6">
          <div className="flex items-center">
            <img
              alt="MVDS logo"
              className="h-4 w-auto shrink-0"
              height="16"
              src={logo}
              width="124"
            />
          </div>

          <div className="flex items-center gap-3">
            <AvatarMenuSearchCommand />
            <div className="flex items-center gap-1.5">
              <ThemeSwitcherDropdown />
              <AvatarMenuDropdown
                email="keith.kennedy@moonvine.design"
                name="Keith Kennedy"
                primaryItems={primaryItems}
                secondaryItems={secondaryItems}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto min-h-screen max-w-[72rem] px-6 pt-15">
        <div className="min-h-[calc(100vh-3.75rem)] border-x border-border px-6 py-10">
          {children}
        </div>
      </div>
    </main>
  );
}
