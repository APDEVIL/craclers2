import { renderToBuffer } from "@react-pdf/renderer";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { category, product, siteSetting } from "@/server/db/schema";
import { PriceListDocument } from "@/server/pdf/price-list";

export async function GET() {
	const [products, categories, settingsRows] = await Promise.all([
		db
			.select()
			.from(product)
			.where(eq(product.isActive, true))
			.orderBy(product.sortOrder),
		db
			.select()
			.from(category)
			.where(eq(category.isActive, true))
			.orderBy(category.sortOrder),
		db.select().from(siteSetting).where(eq(siteSetting.id, 1)).limit(1),
	]);

	const settings = settingsRows[0];

	// Group products by category (same shape as listForEstimate)
	const groups = categories
		.map((cat) => {
			const items = products
				.filter((p) => p.categoryId === cat.id)
				.map((p) => ({
					code: p.code,
					name: p.name,
					unit: p.unit,
					mrpPrice: p.mrpPrice,
					discountPrice: p.discountPrice,
				}));
			return {
				categoryName: cat.name,
				discountLabel: cat.discountLabel ?? null,
				items,
			};
		})
		.filter((g) => g.items.length > 0);

	const pdfBuffer = await renderToBuffer(
		PriceListDocument({
			data: {
				shop: {
					name: settings?.shopName ?? "Sri's Crackers Shop",
					address: settings?.shopAddress ?? null,
				},
				groups,
				generatedAt: new Date(),
			},
		}),
	);

	return new Response(new Uint8Array(pdfBuffer), {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="price-list.pdf"`,
		},
	});
}
