import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { bankAccount } from "@/server/db/schema";

const bankAccountInput = z.object({
	bankName: z.string().min(1).max(120),
	accountHolderName: z.string().min(1).max(120),
	accountNumber: z.string().min(4).max(40),
	ifscCode: z.string().min(4).max(20),
	branchName: z.string().max(150).optional(),
	sortOrder: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

export const bankAccountRouter = createTRPCRouter({
	list: publicProcedure.query(({ ctx }) =>
		ctx.db
			.select()
			.from(bankAccount)
			.where(eq(bankAccount.isActive, true))
			.orderBy(asc(bankAccount.sortOrder)),
	),

	adminList: protectedProcedure.query(({ ctx }) =>
		ctx.db.select().from(bankAccount).orderBy(asc(bankAccount.sortOrder)),
	),

	create: protectedProcedure
		.input(bankAccountInput)
		.mutation(({ ctx, input }) => ctx.db.insert(bankAccount).values(input).returning()),

	update: protectedProcedure
		.input(bankAccountInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { id, ...rest } = input;
			const [updated] = await ctx.db
				.update(bankAccount)
				.set(rest)
				.where(eq(bankAccount.id, id))
				.returning();
			if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
			return updated;
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(bankAccount).where(eq(bankAccount.id, input.id));
			return { success: true };
		}),
});