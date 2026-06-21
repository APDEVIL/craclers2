import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import { ensureGuestSession, getGuestSessionId } from "@/server/guest-session";

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await auth.api.getSession({
		headers: opts.headers,
	});
	const guestSessionId = getGuestSessionId(opts.headers);

	return {
		db,
		session,
		guestSessionId,
		...opts,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	if (t._config.isDev) {
		const waitMs = Math.floor(Math.random() * 400) + 100;
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}

	const result = await next();

	const end = Date.now();
	console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

	return result;
});

/** Public (unauthenticated) procedure — no guarantees about who's calling. */
export const publicProcedure = t.procedure.use(timingMiddleware);

/** Admin-only procedure. Only admins ever log in, so any session = admin. */
export const protectedProcedure = t.procedure
	.use(timingMiddleware)
	.use(({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});

/**
 * Guest procedure — for the normal-user price list / cart / checkout flow.
 * Guarantees ctx.guestSession exists, creating the DB row on first use.
 */
export const guestProcedure = t.procedure
	.use(timingMiddleware)
	.use(async ({ ctx, next }) => {
		const guestSession = await ensureGuestSession(ctx.db, ctx.guestSessionId);
		return next({ ctx: { ...ctx, guestSession } });
	});
