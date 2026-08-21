import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AvatarMenuSearchCommand,
  ThemeSwitcherDropdown,
} from "@/components/navigation/avatar-menu";
import { AppBreadcrumbs } from "@/features/console/components/app-breadcrumbs";
import {
  getActiveNavItem,
  useCurrentConsolePath,
} from "@/features/console/components/app-shared";

export function AppHeader() {
	const currentPath = useCurrentConsolePath();
	const activeItem = getActiveNavItem(currentPath);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6"
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger className="md:hidden" />
				<Separator
					className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
					orientation="vertical"
				/>
				<AppBreadcrumbs page={activeItem} />
			</div>
			<div className="flex items-center gap-2">
				<AvatarMenuSearchCommand />
				<ThemeSwitcherDropdown />
			</div>
		</header>
	);
}
