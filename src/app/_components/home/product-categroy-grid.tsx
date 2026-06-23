import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/server";

export async function ProductCategoryGrid() {
	const categories = await api.category.list();

	if (categories.length === 0) return null;

	return (
		<nav aria-label="Shop by category" className="border-foreground/8 border-b bg-white">
			<div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
				{categories.map((category) => (
					<Link
						className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-foreground/12 bg-secondary/60 px-4 py-2 font-semibold text-foreground text-sm transition hover:border-accent hover:bg-accent/15"
						href={`/estimate?category=${category.slug}`}
						key={category.id}
					>
						<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs">
							{category.imageUrl ? (
								<Image alt="" className="h-4 w-4 object-contain" height={16} src={category.imageUrl} width={16} />
							) : (
								"✺"
							)}
						</span>
						{category.name}
					</Link>
				))}
			</div>
		</nav>
	);
}