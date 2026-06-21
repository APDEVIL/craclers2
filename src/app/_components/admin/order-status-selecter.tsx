"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";

type OrderStatus = "pending" | "contacted" | "confirmed" | "cancelled";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "contacted", "confirmed", "cancelled"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
	const utils = api.useUtils();
	const updateMutation = api.order.updateStatus.useMutation({
		onSuccess: () => {
			void utils.order.getById.invalidate({ id: orderId });
			void utils.order.list.invalidate();
		},
	});

	return (
		<Select value={status} onValueChange={(value) => updateMutation.mutate({ id: orderId, status: value as OrderStatus })}>
			<SelectTrigger className="w-40 capitalize">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{STATUS_OPTIONS.map((option) => (
					<SelectItem key={option} value={option} className="capitalize">
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}