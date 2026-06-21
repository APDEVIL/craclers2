import { TRPCError } from "@trpc/server";
import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { category, product } from "@/server/db/schema";

const productInput = z.object({
	categoryId: z.string(),
	code: z.number().int().positive(),
	name: z.string().min(1).max(200),
	unit: z.string().min(1).max(20).default("PKT"),
	imageUrl: z.string().url().optional(),
	mrpPrice: z.number().positive(),
	discountPrice: z.number().positive(),
	sortOrder: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

const toMoney = (n: number) => n.toFixed(2);

export const productRouter = createTRPCRouter({
	/** Powers the public price-list / estimate page, grouped by category. */
	listForEstimate: publicProcedure.query(async ({ ctx }) => {
		const rows = await ctx.db
			.select({
				categoryId: category.id,
				categoryName: category.name,
				categorySlug: category.slug,
				discountLabel: category.discountLabel,
				categorySortOrder: category.sortOrder,
				productId: product.id,
				code: product.code,
				name: product.name,
				unit: product.unit,
				imageUrl: product.imageUrl,
				mrpPrice: product.mrpPrice,
				discountPrice: product.discountPrice,
			})
			.from(category)
			.innerJoin(
				product,
				and(eq(product.categoryId, category.id), eq(product.isActive, true)),
			)
			.where(eq(category.isActive, true))
			.orderBy(asc(category.sortOrder), asc(product.sortOrder));

		const grouped = new Map<string, { categoryName: string; discountLabel: string | null; items: typeof rows }>();
		for (const row of rows) {
			const existing = grouped.get(row.categoryId);
			if (existing) {
				existing.items.push(row);
			} else {
				grouped.set(row.categoryId, {
					categoryName: row.categoryName,
					discountLabel: row.discountLabel,
					items: [row],
				});
			}
		}
		return Array.from(grouped.entries()).map(([categoryId, v]) => ({ categoryId, ...v }));
	}),

	adminList: protectedProcedure
		.input(z.object({ categoryId: z.string().optional(), search: z.string().optional() }))
		.query(({ ctx, input }) =>
			ctx.db
				.select()
				.from(product)
				.where(
					and(
						input.categoryId ? eq(product.categoryId, input.categoryId) : undefined,
						input.search ? ilike(product.name, `%${input.search}%`) : undefined,
					),
				)
				.orderBy(asc(product.sortOrder)),
		),

	create: protectedProcedure.input(productInput).mutation(async ({ ctx, input }) => {
		try {
			const [created] = await ctx.db
				.insert(product)
				.values({
					...input,
					mrpPrice: toMoney(input.mrpPrice),
					discountPrice: toMoney(input.discountPrice),
				})
				.returning();
			return created;
		} catch (err) {
			if (isUniqueViolation(err)) {
				throw new TRPCError({ code: "CONFLICT", message: `Code ${input.code} is already used by another product` });
			}
			throw err;
		}
	}),

	update: protectedProcedure
		.input(productInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { id, mrpPrice, discountPrice, ...rest } = input;
			try {
				const [updated] = await ctx.db
					.update(product)
					.set({
						...rest,
						...(mrpPrice !== undefined ? { mrpPrice: toMoney(mrpPrice) } : {}),
						...(discountPrice !== undefined ? { discountPrice: toMoney(discountPrice) } : {}),
						updatedAt: new Date(),
					})
					.where(eq(product.id, id))
					.returning();
				if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
				return updated;
			} catch (err) {
				if (isUniqueViolation(err)) {
					throw new TRPCError({ code: "CONFLICT", message: "That code is already used by another product" });
				}
				throw err;
			}
		}),

	toggleActive: protectedProcedure
		.input(z.object({ id: z.string(), isActive: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(product)
				.set({ isActive: input.isActive, updatedAt: new Date() })
				.where(eq(product.id, input.id))
				.returning();
			if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
			return updated;
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// safe: orderItem snapshots product data and uses onDelete "set null"
			await ctx.db.delete(product).where(eq(product.id, input.id));
			return { success: true };
		}),

	reorder: protectedProcedure
		.input(z.array(z.object({ id: z.string(), sortOrder: z.number().int() })))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				for (const { id, sortOrder } of input) {
					await tx.update(product).set({ sortOrder }).where(eq(product.id, id));
				}
			});
			return { success: true };
		}),
});

function isUniqueViolation(err: unknown): boolean {
	return (
		typeof err === "object" &&
		err !== null &&
		"code" in err &&
		(err as { code: string }).code === "23505"
	);
}