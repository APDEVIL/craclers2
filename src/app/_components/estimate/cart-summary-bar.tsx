"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface CartSummaryBarProps {
	minimumOrderAmount: number;
	onCheckout: () => void;
}

export function CartSummaryBar({ minimumOrderAmount, onCheckout }: CartSummaryBarProps) {
	const cart = useCart();

	if (cart.itemCount === 0) return null;

	const meetsMinimum = cart.grandTotal >= minimumOrderAmount;

	return (
		<div className="fixed inset-x-0 bottom-0 z-30 border-[#14163A]/10 border-t bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
				<div>
					<p className="text-[#14163A]/55 text-xs">{cart.itemCount} item(s)</p>
					<p className="font-extrabold text-[#14163A] text-lg">₹{cart.grandTotal.toFixed(2)}</p>
					{!meetsMinimum ? (
						<p className="font-medium text-[#C8202F] text-[11px]">
							Add ₹{(minimumOrderAmount - cart.grandTotal).toFixed(2)} more to reach the ₹{minimumOrderAmount.toFixed(2)} minimum
						</p>
					) : null}
				</div>
				<Button
					onClick={onCheckout}
					disabled={!meetsMinimum}
					className={cn(
						"rounded-full px-6 font-semibold",
						meetsMinimum ? "bg-[#C8202F] hover:bg-[#a81b27]" : "bg-[#14163A]/20 text-[#14163A]/50",
					)}
				>
					Checkout
				</Button>
			</div>
		</div>
	);
}