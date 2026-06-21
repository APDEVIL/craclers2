import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
	createTRPCRouter,
	guestProcedure,
	protectedProcedure,
} from "@/server/api/trpc";
import { cartItem, guestSession, product } from "@/server/db/schema";

export const cartRouter = createTRPCRouter({
	get: guestProcedure.query(async ({ ctx }) => {
		const items = await ctx.db
			.select({
				productId: product.id,
				code: product.code,
				name: product.name,
				unit: product.unit,
				imageUrl: product.imageUrl,
				mrpPrice: product.mrpPrice,
				discountPrice: product.discountPrice,
				quantity: cartItem.quantity,
			})
			.from(cartItem)
			.innerJoin(product, eq(cartItem.productId, product.id))
			.where(eq(cartItem.guestSessionId, ctx.guestSession.id));

		const netTotal = items.reduce(
			(sum, i) => sum + Number(i.mrpPrice) * i.quantity,
			0,
		);
		const grandTotal = items.reduce(
			(sum, i) => sum + Number(i.discountPrice) * i.quantity,
			0,
		);

		return { items, netTotal, youSave: netTotal - grandTotal, grandTotal };
	}),

	// called on every quantity-field change in the price list
	upsertItem: guestProcedure
		.input(z.object({ productId: z.string(), quantity: z.number().int() }))
		.mutation(async ({ ctx, input }) => {
			if (input.quantity <= 0) {
				await ctx.db
					.delete(cartItem)
					.where(
						and(
							eq(cartItem.guestSessionId, ctx.guestSession.id),
							eq(cartItem.productId, input.productId),
						),
					);
				return { removed: true };
			}

			await ctx.db
				.insert(cartItem)
				.values({
					guestSessionId: ctx.guestSession.id,
					productId: input.productId,
					quantity: input.quantity,
				})
				.onConflictDoUpdate({
					target: [cartItem.guestSessionId, cartItem.productId],
					set: { quantity: input.quantity, updatedAt: new Date() },
				});

			return { removed: false };
		}),

	clear: guestProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(cartItem)
			.where(eq(cartItem.guestSessionId, ctx.guestSession.id));
	}),

	// admin dashboard: in-progress / abandoned estimates
	adminListActive: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db
			.select({
				guestSessionId: guestSession.id,
				lastActiveAt: guestSession.lastActiveAt,
				itemCount: sql<number>`count(${cartItem.id})`.as("item_count"),
				totalQuantity: sql<number>`coalesce(sum(${cartItem.quantity}), 0)`.as(
					"total_quantity",
				),
			})
			.from(guestSession)
			.leftJoin(cartItem, eq(cartItem.guestSessionId, guestSession.id))
			.where(eq(guestSession.status, "active"))
			.groupBy(guestSession.id, guestSession.lastActiveAt)
			.having(sql`count(${cartItem.id}) > 0`)
			.orderBy(desc(guestSession.lastActiveAt));
	}),
});
