"use client";

import { ChevronLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	footerNavLinks,
	getNavGroups,
	type SidebarNavItem,
	useCurrentConsolePath,
} from "@/features/console/components/app-shared";
import { NavUser } from "@/features/console/components/nav-user";
import { settingsNavItems } from "@/features/settings/config/settings-nav";

function SidebarIconBadge({
	item,
}: {
	item: SidebarNavItem;
}) {
	const variant = item.badgeVariant ?? "outline";

	return (
		<Badge
			className="size-6 rounded-md p-0 [&_svg]:size-3.5 [&_svg]:opacity-100"
			size="lg"
			variant={variant}
		>
			{item.icon}
		</Badge>
	);
}

export function AppSidebar() {
	const currentPath = useCurrentConsolePath();
	const currentNavGroups = getNavGroups(currentPath);
	const isSettings = currentPath.startsWith("#/settings");
	const visibleNavGroups = isSettings
		? [
				{
					items: settingsNavItems.map((item) => ({
						...item,
						isActive: item.url === currentPath,
					})),
				},
			]
		: currentNavGroups;

	return (
		<Sidebar
			className="static min-h-full *:data-[slot=sidebar-inner]:bg-background"
			collapsible="offExamples"
			variant="sidebar"
		>
			<SidebarHeader className={isSettings ? "relative h-14 px-2 py-0" : "relative h-14 p-0"}>
				{isSettings ? (
					<SidebarMenu className="h-full px-0 py-2">
						<SidebarMenuItem>
							<SidebarMenuButton
								className="h-10 font-medium"
								render={<a href="#/observatory" />}
								tooltip="Back to console"
							>
								<ChevronLeftIcon />
								<span>Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				) : (
					<NavUser />
				)}
			</SidebarHeader>
			<SidebarContent>
				{visibleNavGroups.map((group, index) => (
					<SidebarGroup key={`sidebar-group-${index}`}>
						{group.label && group.label !== "Console" && (
							<SidebarGroupLabel className="font-normal">
								{group.label}
							</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={item.isActive}
										render={<a href={item.url} />}
										tooltip={item.title}
									>
										<SidebarIconBadge item={item} />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								className="text-muted-foreground"
								isActive={item.isActive}
								render={<a href={item.url} />}
								size="sm"
							>
								<SidebarIconBadge item={item} />
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
