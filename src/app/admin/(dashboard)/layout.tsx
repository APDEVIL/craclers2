import { redirect } from "next/navigation";

import { AdminSidebar } from "@/app/_components/admin/admin-sidebar";
import { getSession } from "@/server/better-auth/server";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession();

	if (!session?.user) {
		redirect("/admin/login");
	}

	return (
		<div className="flex min-h-screen bg-[#F7F7FB]">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	);
}