import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@/server/better-auth";

const f = createUploadthing();

const requireAdmin = async ({ req }: { req: Request }) => {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session?.user) throw new UploadThingError("Unauthorized");
	return { userId: session.user.id };
};

export const ourFileRouter = {
	productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(requireAdmin)
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

	categoryImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
		.middleware(requireAdmin)
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;