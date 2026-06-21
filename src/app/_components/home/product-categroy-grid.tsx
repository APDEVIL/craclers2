import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/server";

export async function ProductCategoryGrid() {
	const categories = await api.category.list();

	if (categories.length === 0) return null;

	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
			<h2 className="text-center font-extrabold text-3xl text-[#14163A]">
				Our products
			</h2>
			<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{categories.map((category) => (
					<Link
						className="flex items-center gap-4 rounded-lg bg-[#D9A640]/90 px-6 py-5 font-bold text-[#14163A] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
						href={`/estimate?category=${category.slug}`}
						key={category.id}
					>
						<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/70">
							{category.imageUrl ? (
								<Image
									alt=""
									className="h-7 w-7 object-contain"
									height={28}
									src={category.imageUrl}
									width={28}
								/>
							) : (
								<span className="text-lg">✺</span>
							)}
						</span>
						<span className="text-base uppercase tracking-wide">
							{category.name}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
