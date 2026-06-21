import { desc } from "drizzle-orm";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { lead } from "@/server/db/schema";

export const leadRouter = createTRPCRouter({
	submit: publicProcedure
		.input(
			z.object({
				name: z.string().min(2).max(120),
				mobile: z.string().min(8).max(20),
				source: z.string().max(40).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [created] = await ctx.db.insert(lead).values(input).returning();
			return created;
		}),

	list: protectedProcedure.query(({ ctx }) =>
		ctx.db.select().from(lead).orderBy(desc(lead.createdAt)),
	),
});
