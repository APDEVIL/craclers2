"use client";

import { useState } from "react";

import { OrdersTable } from "@/app/_components/admin/orders-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StatusFilter = "all" | "pending" | "contacted" | "confirmed" | "cancelled";

const TABS: { value: StatusFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "contacted", label: "Contacted" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
	const [filter, setFilter] = useState<StatusFilter>("all");

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display font-extrabold text-2xl text-[#14163A]">Orders</h1>
				<p className="text-[#14163A]/55 text-sm">Estimates submitted by customers, newest first.</p>
			</div>

			<Tabs value={filter} onValueChange={(value) => setFilter(value as StatusFilter)}>
				<TabsList>
					{TABS.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<OrdersTable statusFilter={filter === "all" ? undefined : filter} />
		</div>
	);
}