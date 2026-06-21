import "server-only";

import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import type { db as Database } from "@/server/db";
import { guestSession } from "@/server/db/schema";

export const GUEST_SESSION_COOKIE = "guest_session_id";

export function getGuestSessionId(headers: Headers): string | null {
    const cookieHeader = headers.get("cookie");
    if (!cookieHeader) return null;

    const match = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${GUEST_SESSION_COOKIE}=`));

    if (!match) return null;
    return decodeURIComponent(match.split("=")[1] ?? "") || null;
}

/**
 * Looks up (or lazily creates) the guestSession row for the id issued by
 * middleware.ts. Also bumps lastActiveAt so admin can see live activity.
 */
export async function ensureGuestSession(
    db: typeof Database,
    guestSessionId: string | null,
) {
    if (!guestSessionId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Missing guest session id — middleware did not run on this request.",
        });
    }

    const [existing] = await db
        .select()
        .from(guestSession)
        .where(eq(guestSession.id, guestSessionId))
        .limit(1);

    if (existing) {
        const [updated] = await db
            .update(guestSession)
            .set({ lastActiveAt: new Date() })
            .where(eq(guestSession.id, guestSessionId))
            .returning();
        return updated!;
    }

    const [created] = await db
        .insert(guestSession)
        .values({ id: guestSessionId })
        .onConflictDoNothing()
        .returning();

    if (created) return created;

    // Rare race: another request inserted it between our select and insert.
    const [fallback] = await db
        .select()
        .from(guestSession)
        .where(eq(guestSession.id, guestSessionId))
        .limit(1);

    if (!fallback) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to establish guest session in database.",
        });
    }
    return fallback;
}