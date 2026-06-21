import { TRPCError } from "@trpc/server";
import { asc, count, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { category, product } from "@/server/db/schema";

const categoryInput = z.object({
	name: z.string().min(1).max(120),
	slug: z
		.string()
		.min(1)
		.max(120)
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens only"),
	discountLabel: z.string().max(60).optional(),
	sortOrder: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const categoryRouter = createTRPCRouter({
	list: publicProcedure.query(({ ctx }) =>
		ctx.db
			.select()
			.from(category)
			.where(eq(category.isActive, true))
			.orderBy(asc(category.sortOrder)),
	),

	adminList: protectedProcedure.query(({ ctx }) =>
		ctx.db.select().from(category).orderBy(asc(category.sortOrder)),
	),

	create: protectedProcedure.input(categoryInput).mutation(async ({ ctx, input }) => {
		try {
			const [created] = await ctx.db.insert(category).values(input).returning();
			return created;
		} catch (err) {
			if (isUniqueViolation(err)) {
				throw new TRPCError({ code: "CONFLICT", message: "That slug is already in use" });
			}
			throw err;
		}
	}),

	update: protectedProcedure
		.input(categoryInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { id, ...rest } = input;
			try {
				const [updated] = await ctx.db
					.update(category)
					.set({ ...rest, updatedAt: new Date() })
					.where(eq(category.id, id))
					.returning();
				if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
				return updated;
			} catch (err) {
				if (isUniqueViolation(err)) {
					throw new TRPCError({ code: "CONFLICT", message: "That slug is already in use" });
				}
				throw err;
			}
		}),

delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const [result] = await ctx.db
            .select({ value: count() })
            .from(product)
            .where(eq(product.categoryId, input.id));

        const productCount = result?.value ?? 0;

        if (productCount > 0) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: `This category still has ${productCount} product(s). Move or delete them first.`,
            });
        }

        await ctx.db.delete(category).where(eq(category.id, input.id));
        return { success: true };
    }),

	reorder: protectedProcedure
		.input(z.array(z.object({ id: z.string(), sortOrder: z.number().int() })))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				for (const { id, sortOrder } of input) {
					await tx.update(category).set({ sortOrder }).where(eq(category.id, id));
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