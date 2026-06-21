"use client";

import { Fragment, useMemo } from "react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/trpc/react";
import { PriceListRow } from "./price-list-row";

interface PriceListTableProps {
	categoryId: string | null;
	search: string;
}

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4"] as const;

export function PriceListTable({ categoryId, search }: PriceListTableProps) {
	const { data, isLoading } = api.product.listForEstimate.useQuery();
	const cart = useCart();

	const groups = useMemo(() => {
		if (!data) return [];
		const term = search.trim().toLowerCase();
		return data
			.filter((group) => !categoryId || group.categoryId === categoryId)
			.map((group) => ({
				...group,
				items: group.items.filter((item) => (term ? item.name.toLowerCase().includes(term) : true)),
			}))
			.filter((group) => group.items.length > 0);
	}, [data, categoryId, search]);

	if (isLoading) {
		return (
			<div className="space-y-3 py-10">
				{SKELETON_ROWS.map((rowKey) => (
					<div key={rowKey} className="h-14 animate-pulse rounded-md bg-[#14163A]/5" />
				))}
			</div>
		);
	}

	if (groups.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-16 text-center">
				<p className="font-semibold text-[#14163A] text-lg">No products found</p>
				<p className="text-[#14163A]/60 text-sm">Try a different category or search term.</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-[#14163A]/10">
			<table className="w-full min-w-[860px] border-collapse text-sm">
				<thead>
					<tr className="bg-[#14163A] text-left text-white">
						<th className="w-20 px-4 py-3 font-semibold">Image</th>
						<th className="w-16 px-4 py-3 font-semibold">Code</th>
						<th className="px-4 py-3 font-semibold">Product name</th>
						<th className="w-28 px-4 py-3 text-right font-semibold">MRP price</th>
						<th className="w-32 px-4 py-3 text-right font-semibold">Discount price</th>
						<th className="w-28 px-4 py-3 text-center font-semibold">Qty</th>
						<th className="w-32 px-4 py-3 text-right font-semibold">Total</th>
					</tr>
				</thead>
				<tbody>
					{groups.map((group) => (
						<Fragment key={group.categoryId}>
							<tr>
								<td className="bg-[#D9A640]/90 px-4 py-2.5 text-center font-bold text-[#14163A] text-sm uppercase tracking-wide" colSpan={7}>
									{group.categoryName}
									{group.discountLabel ? ` (${group.discountLabel})` : ""}
								</td>
							</tr>
							{group.items.map((item) => (
								<PriceListRow
									key={item.productId}
									item={item}
									onQuantityChange={(qty) =>
										cart.setQuantity(item.productId, qty, {
											code: item.code,
											discountPrice: item.discountPrice,
											imageUrl: item.imageUrl,
											mrpPrice: item.mrpPrice,
											name: item.name,
											unit: item.unit,
										})
									}
									quantity={cart.getQuantity(item.productId)}
								/>
							))}
						</Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
}