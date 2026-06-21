import { Inbox, Package, Receipt, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { api } from "@/trpc/server";

export default async function AdminDashboardPage() {
	const [pendingOrders, allOrders, products, activeCarts, leads] = await Promise.all([
		api.order.list({ status: "pending" }),
		api.order.list({}),
		api.product.adminList({}),
		api.cart.adminListActive(),
		api.lead.list(),
	]);

	const pendingRevenue = pendingOrders.reduce((sum, o) => sum + Number(o.grandTotal), 0);

	const stats = [
		{ label: "Pending estimates", value: pendingOrders.length, sub: `₹${pendingRevenue.toFixed(2)} potential`, href: "/admin/orders", icon: Inbox },
		{ label: "Total estimates", value: allOrders.length, sub: "all time", href: "/admin/orders", icon: Receipt },
		{ label: "Active products", value: products.filter((p) => p.isActive).length, sub: `${products.length} total`, href: "/admin/products", icon: Package },
		{ label: "In-progress carts", value: activeCarts.length, sub: "not yet submitted", href: "/admin/orders", icon: ShoppingCart },
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-display font-extrabold text-2xl text-[#14163A]">Dashboard</h1>
				<p className="text-[#14163A]/55 text-sm">A quick look at what needs your attention today.</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Link
							key={stat.label}
							href={stat.href}
							className="rounded-lg border border-[#14163A]/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
						>
							<span className="grid h-10 w-10 place-items-center rounded-full bg-[#14163A]/5 text-[#C8202F]">
								<Icon className="h-5 w-5" />
							</span>
							<p className="mt-4 font-extrabold text-2xl text-[#14163A]">{stat.value}</p>
							<p className="font-semibold text-[#14163A]/70 text-sm">{stat.label}</p>
							<p className="text-[#14163A]/50 text-xs">{stat.sub}</p>
						</Link>
					);
				})}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-[#14163A]/10 bg-white p-5">
					<div className="flex items-center justify-between">
						<h2 className="font-bold text-[#14163A]">Recent estimates</h2>
						<Link href="/admin/orders" className="font-medium text-[#C8202F] text-sm hover:underline">
							View all
						</Link>
					</div>
					<div className="mt-4 space-y-1">
						{allOrders.slice(0, 5).map((order) => (
							<Link
								key={order.id}
								href={`/admin/orders/${order.id}`}
								className="flex items-center justify-between rounded-md px-2 py-2 text-sm transition hover:bg-[#14163A]/5"
							>
								<div>
									<p className="font-semibold text-[#14163A]">{order.billNumber}</p>
									<p className="text-[#14163A]/55 text-xs">{order.customerName}</p>
								</div>
								<p className="font-bold text-[#14163A]">₹{order.grandTotal}</p>
							</Link>
						))}
						{allOrders.length === 0 ? <p className="py-6 text-center text-[#14163A]/50 text-sm">No estimates yet.</p> : null}
					</div>
				</div>

				<div className="rounded-lg border border-[#14163A]/10 bg-white p-5">
					<h2 className="font-bold text-[#14163A]">Recent leads</h2>
					<div className="mt-4 space-y-1">
						{leads.slice(0, 5).map((lead) => (
							<div key={lead.id} className="flex items-center justify-between rounded-md px-2 py-2 text-sm">
								<div>
									<p className="font-semibold text-[#14163A]">{lead.name}</p>
									<p className="text-[#14163A]/55 text-xs">{lead.source ?? "—"}</p>
								</div>
								<a href={`tel:${lead.mobile}`} className="font-medium text-[#C8202F] hover:underline">
									{lead.mobile}
								</a>
							</div>
						))}
						{leads.length === 0 ? <p className="py-6 text-center text-[#14163A]/50 text-sm">No leads yet.</p> : null}
					</div>
				</div>
			</div>
		</div>
	);
}