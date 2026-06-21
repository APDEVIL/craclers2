"use client";

import { LayoutDashboard, ListTree, LogOut, Package, Receipt, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";

const NAV_ITEMS = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/products", label: "Products", icon: Package },
	{ href: "/admin/categories", label: "Categories", icon: ListTree },
	{ href: "/admin/orders", label: "Orders", icon: Receipt },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/admin/login");
		router.refresh();
	};

	return (
		<aside className="flex h-screen w-60 shrink-0 flex-col border-[#14163A]/10 border-r bg-[#14163A] text-white">
			<div className="flex items-center gap-3 px-5 py-6">
				<span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 font-bold text-[#D9A640] text-base">
					SS
				</span>
				<span className="font-bold text-sm leading-tight">
					SS Crackers Shop
					<span className="block font-medium text-white/55 text-xs">Admin panel</span>
				</span>
			</div>

			<nav className="flex-1 space-y-1 px-3">
				{NAV_ITEMS.map((item) => {
					const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold text-sm transition",
								isActive ? "bg-[#D9A640] text-[#14163A]" : "text-white/75 hover:bg-white/10 hover:text-white",
							)}
						>
							<Icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="px-3 py-5">
				<Button
					variant="ghost"
					onClick={handleSignOut}
					className="w-full justify-start gap-3 text-white/75 hover:bg-white/10 hover:text-white"
				>
					<LogOut className="h-4 w-4" />
					Sign out
				</Button>
			</div>
		</aside>
	);
}