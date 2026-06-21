"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/trpc/react";

export interface CartLineMeta {
	code: number;
	name: string;
	unit: string;
	imageUrl: string | null;
	mrpPrice: string;
	discountPrice: string;
}

export interface CartLine extends CartLineMeta {
	productId: string;
	quantity: number;
}

const DEBOUNCE_MS = 500;

export function useCart() {
	const utils = api.useUtils();

	const cartQuery = api.cart.get.useQuery(undefined, {
		refetchOnWindowFocus: false,
	});

	const upsertMutation = api.cart.upsertItem.useMutation({
		onSettled: () => {
			void utils.cart.get.invalidate();
		},
	});

	const clearMutation = api.cart.clear.useMutation({
		onSuccess: () => {
			setLines(new Map());
			void utils.cart.get.invalidate();
		},
	});

	const [lines, setLines] = useState<Map<string, CartLine>>(new Map());
	// productIds the user is actively editing — never clobbered by a server refetch
	const dirtyIds = useRef<Set<string>>(new Set());
	const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	useEffect(() => {
		if (!cartQuery.data) return;

		setLines((prev) => {
			const next = new Map(prev);

			for (const item of cartQuery.data.items) {
				if (dirtyIds.current.has(item.productId)) continue;
				next.set(item.productId, { ...item });
			}

			for (const id of Array.from(next.keys())) {
				const stillOnServer = cartQuery.data.items.some(
					(i) => i.productId === id,
				);
				if (!stillOnServer && !dirtyIds.current.has(id)) next.delete(id);
			}

			return next;
		});
	}, [cartQuery.data]);

	/** Called from every qty input's onChange. meta is required the first time
	 *  a product is touched (server doesn't know about it yet). */
	const setQuantity = useCallback(
		(productId: string, quantity: number, meta?: CartLineMeta) => {
			const safeQuantity = Math.max(0, Math.floor(quantity) || 0);

			setLines((prev) => {
				const next = new Map(prev);
				if (safeQuantity === 0) {
					next.delete(productId);
				} else {
					const base = next.get(productId) ?? meta;
					if (!base) return prev; // no price data yet, ignore silently
					next.set(productId, { ...base, productId, quantity: safeQuantity });
				}
				return next;
			});

			dirtyIds.current.add(productId);

			const existingTimer = timers.current.get(productId);
			if (existingTimer) clearTimeout(existingTimer);

			const timer = setTimeout(() => {
				upsertMutation.mutate({ productId, quantity: safeQuantity });
				dirtyIds.current.delete(productId);
				timers.current.delete(productId);
			}, DEBOUNCE_MS);

			timers.current.set(productId, timer);
		},
		[upsertMutation],
	);

	/** Flush pending debounced writes immediately — call before navigating to checkout. */
	const flush = useCallback(() => {
		for (const [productId, timer] of timers.current) {
			clearTimeout(timer);
			const line = lines.get(productId);
			upsertMutation.mutate({ productId, quantity: line?.quantity ?? 0 });
			dirtyIds.current.delete(productId);
		}
		timers.current.clear();
	}, [lines, upsertMutation]);

	useEffect(() => {
		return () => {
			for (const timer of timers.current.values()) clearTimeout(timer);
		};
	}, []);

	const items = useMemo(() => Array.from(lines.values()), [lines]);

	const totals = useMemo(() => {
		let netTotal = 0;
		let grandTotal = 0;
		for (const item of items) {
			netTotal += Number(item.mrpPrice) * item.quantity;
			grandTotal += Number(item.discountPrice) * item.quantity;
		}
		return { netTotal, youSave: netTotal - grandTotal, grandTotal };
	}, [items]);

	const itemCount = useMemo(
		() => items.reduce((sum, i) => sum + i.quantity, 0),
		[items],
	);

	return {
		items,
		getQuantity: (productId: string) => lines.get(productId)?.quantity ?? 0,
		setQuantity,
		flush,
		clear: () => clearMutation.mutate(),
		itemCount,
		...totals,
		isLoading: cartQuery.isLoading,
		isClearing: clearMutation.isPending,
	};
}
