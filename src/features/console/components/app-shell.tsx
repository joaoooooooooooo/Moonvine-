import { SideLineBackground } from "@/components/ui/line-background";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { AppHeader } from "@/features/console/components/app-header";
import { AppSidebar } from "@/features/console/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative overflow-hidden">
			<SideLineBackground contentWidth="80rem" variant="small" />
			<SidebarProvider className="relative mx-auto h-svh w-full max-w-7xl lg:border-x">
				<FullWidthDivider className="top-14 z-40 -translate-y-px" />
				<AppSidebar />
				<SidebarInset>
					<AppHeader />
					<div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
