import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const cookieName = "guest_session_id";
    const existingSession = request.cookies.get(cookieName)?.value;

    // 1. If they already have a session, let the request pass through normally
    if (existingSession) {
        return NextResponse.next();
    }

    // 2. Generate a new session ID for the new visitor
    const newSessionId = crypto.randomUUID();

    // 3. Clone the incoming headers so we can modify them
    const requestHeaders = new Headers(request.headers);
    
    // 4. Append the new cookie to the cloned request headers
    // This is the critical step that allows tRPC to see the cookie immediately on the server
    const currentCookies = requestHeaders.get("cookie") || "";
    const separator = currentCookies ? "; " : "";
    requestHeaders.set("cookie", `${currentCookies}${separator}${cookieName}=${newSessionId}`);

    // 5. Create the response, passing the modified headers forward to the Next.js server
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // 6. Set the cookie on the outgoing response so the user's browser saves it
    response.cookies.set(cookieName, newSessionId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        // Set an expiration if desired, e.g., maxAge: 60 * 60 * 24 * 30 (30 days)
    });

    return response;
}

// 7. Ensure the middleware runs on all relevant routes, but ignores static files and images
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};