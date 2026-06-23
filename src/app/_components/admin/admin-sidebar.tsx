"use client";

import { LayoutDashboard, ListTree, LogOut, Menu, Package, Receipt, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";

const NAV_ITEMS = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/products", label: "Products", icon: Package },
	{ href: "/admin/categories", label: "Categories", icon: ListTree },
	{ href: "/admin/orders", label: "Orders", icon: Receipt },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/admin/login");
		router.refresh();
	};

	return (
		<>
			<div className="flex items-center gap-3 px-5 py-6">
				<span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand-gold)]/15 font-bold text-[var(--brand-gold)] text-base">
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
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold text-sm transition",
								isActive
									? "bg-[var(--brand-maroon)] text-white"
									: "text-white/75 hover:bg-white/10 hover:text-white",
							)}
							href={item.href}
							key={item.href}
							onClick={onNavigate}
						>
							<Icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="px-3 py-5">
				<Button
					className="w-full justify-start gap-3 text-white/75 hover:bg-white/10 hover:text-white"
					onClick={handleSignOut}
					variant="ghost"
				>
					<LogOut className="h-4 w-4" />
					Sign out
				</Button>
			</div>
		</>
	);
}

export function AdminSidebar() {
	const [open, setOpen] = useState(false);
	const _pathname = usePathname();

	// Close the mobile sheet whenever the route changes — covers
	// back/forward nav and programmatic redirects, not just link clicks.
	useEffect(() => {
		setOpen(false);
	}, []);

	return (
		<>
			<aside className="hidden h-screen w-60 shrink-0 flex-col border-[var(--brand-navy)]/10 border-r bg-[var(--brand-navy)] text-white lg:flex">
				<AdminNavLinks />
			</aside>

			<div className="flex items-center justify-between border-white/10 border-b bg-[var(--brand-navy)] px-4 py-3 text-white lg:hidden">
				<div className="flex items-center gap-2.5">
					<span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-gold)]/15 font-bold text-[var(--brand-gold)] text-sm">
						SS
					</span>
					<span className="font-bold text-sm">Admin panel</span>
				</div>

				<Sheet onOpenChange={setOpen} open={open}>
					<SheetTrigger asChild>
						<Button
							aria-label="Open admin menu"
							className="text-white hover:bg-white/10 hover:text-white"
							size="icon"
							variant="ghost"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent className="flex w-64 flex-col border-none bg-[var(--brand-navy)] p-0 text-white" side="left">
						<AdminNavLinks onNavigate={() => setOpen(false)} />
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}