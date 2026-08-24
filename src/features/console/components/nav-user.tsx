"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, UserIcon, BellIcon, CreditCardIcon, SettingsIcon, LifeBuoyIcon, LogOutIcon } from "lucide-react";

type UserType = {
	name: string;
	email: string;
	avatar: string;
};

const user: UserType = {
	name: "Apta",
	email: "hello@apta.agency",
	avatar: "https://github.com/shabanhr.png",
};

export function NavUser() {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu className="h-14 border-b px-2 py-2">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="h-10 text-muted-foreground">
							<Avatar className="size-5">
								<AvatarImage alt={user.name} src={user.avatar} />
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<span className="font-medium text-sm">
								{user.name}
							</span>
							<ChevronsUpDownIcon className="ml-auto size-3!" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-48"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<UserIcon
								/>
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<BellIcon
								/>
								Notifications
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCardIcon
								/>
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<SettingsIcon
								/>
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LifeBuoyIcon
								/>
								Help Center
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">
							<LogOutIcon
							/>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
