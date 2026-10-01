import { SideLineBackground } from "@/components/ui/line-background";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FullWidthDivider } from "@/features/console/components/full-width-divider";
import { AppHeader } from "@/features/console/components/app-header";
import { AppSidebar } from "@/features/console/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative overflow-hidden">
			<SideLineBackground contentWidth="80rem" variant="small" />
			<SidebarProvider className="relative mx-auto h-svh w-full max-w-[110rem] lg:border-x">
			
				<AppSidebar />
				<SidebarInset>
					<AppHeader />
					<div className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
						<div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-4">
							{children}
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
