"use client";

import { Download } from "lucide-react";
import Link from "next/link";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";

type OrderStatus = "pending" | "contacted" | "confirmed" | "cancelled";

const STATUS_STYLES: Record<OrderStatus, string> = {
	pending: "bg-amber-100 text-amber-800",
	contacted: "bg-blue-100 text-blue-800",
	confirmed: "bg-emerald-100 text-emerald-800",
	cancelled: "bg-red-100 text-red-800",
};

const STATUS_OPTIONS: OrderStatus[] = [
	"pending",
	"contacted",
	"confirmed",
	"cancelled",
];

interface OrdersTableProps {
	statusFilter?: OrderStatus;
}

export function OrdersTable({ statusFilter }: OrdersTableProps) {
	const utils = api.useUtils();
	const { data: orders = [], isLoading } = api.order.list.useQuery({
		status: statusFilter,
	});

	const updateStatusMutation = api.order.updateStatus.useMutation({
		onSuccess: () => void utils.order.list.invalidate(),
	});

	if (isLoading) {
		return (
			<div className="space-y-2">
				{[1, 2, 3, 4, 5].map((id) => (
					<div
						className="h-12 animate-pulse rounded-md bg-[#5C1024]/5"
						key={`skeleton-row-${id}`}
					/>
				))}
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="rounded-lg border border-[#5C1024]/15 border-dashed py-16 text-center">
				<p className="font-semibold text-[#5C1024]">No estimates yet</p>
				<p className="text-[#5C1024]/55 text-sm">
					Submitted estimates will show up here.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-[#5C1024]/10 bg-white">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Bill no.</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>WhatsApp</TableHead>
						<TableHead>State</TableHead>
						<TableHead className="text-right">Grand total</TableHead>
						<TableHead>Placed on</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Bill</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell className="font-semibold text-[#5C1024]">
								<Link
									className="hover:underline"
									href={`/admin/orders/${order.id}`}
								>
									{order.billNumber}
								</Link>
							</TableCell>
							<TableCell>{order.customerName}</TableCell>
							<TableCell>
								<a
									className="text-emerald-600 hover:underline"
									href={`https://wa.me/91${order.customerWhatsapp.replace(/\D/g, "")}`}
									rel="noopener noreferrer"
									target="_blank"
								>
									{order.customerWhatsapp}
								</a>
							</TableCell>
							<TableCell>{order.customerState}</TableCell>
							<TableCell className="text-right font-semibold">
								₹{order.grandTotal}
							</TableCell>
							<TableCell className="text-[#5C1024]/60">
								{new Date(order.createdAt).toLocaleDateString("en-IN", {
									day: "2-digit",
									month: "short",
									year: "numeric",
								})}
							</TableCell>
							<TableCell>
								<Select
									onValueChange={(value) =>
										updateStatusMutation.mutate({
											id: order.id,
											status: value as OrderStatus,
										})
									}
									value={order.status}
								>
									<SelectTrigger
										className={`h-8 w-32 border-none font-semibold text-xs capitalize ${STATUS_STYLES[order.status as OrderStatus]}`}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{STATUS_OPTIONS.map((status) => (
											<SelectItem
												className="capitalize"
												key={status}
												value={status}
											>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</TableCell>
							<TableCell className="text-right">
								<a
									aria-label={`Download bill ${order.billNumber}`}
									className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5C1024]/60 transition hover:bg-[#5C1024]/8 hover:text-[#5C1024]"
									href={`/api/orders/${order.id}/pdf`}
									rel="noopener noreferrer"
									target="_blank"
								>
									<Download className="h-4 w-4" />
								</a>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
