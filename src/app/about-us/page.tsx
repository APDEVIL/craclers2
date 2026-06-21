import { BadgeIndianRupee, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { api } from "@/trpc/server";

const PROMISES = [
	{
		icon: Sparkles,
		title: "Manufacturer-direct quality",
		description:
			"Every cracker ships straight from our Sivakasi factory, made with certified raw materials under strict government norms.",
	},
	{
		icon: BadgeIndianRupee,
		title: "Honest pricing",
		description:
			"No middlemen markups — the discount you see on the price list is the manufacturer rate, not an inflated MRP trick.",
	},
	{
		icon: ShieldCheck,
		title: "Safety first",
		description:
			"A dedicated quality-control team checks every batch so what reaches your home is safe for children and adults alike.",
	},
	{
		icon: Truck,
		title: "Pan-India shipping",
		description:
			"We ship across Tamil Nadu and to other states through registered, legal transport providers — tracked end to end.",
	},
] as const;

export default async function AboutUsPage() {
	const settings = await api.settings.get();

	return (
		<div className="px-4 py-14 sm:px-6">
			<div className="mx-auto max-w-3xl text-center">
				<h1 className="font-display font-extrabold text-3xl text-[#14163A] sm:text-4xl">
					About {settings.shopName}
				</h1>
				<p className="mt-4 text-[#14163A]/65">
					We&apos;re a Sivakasi-based cracker manufacturer bringing wholesale, factory-direct pricing straight to
					your doorstep — without losing sight of the quality and safety every Diwali deserves.
				</p>
			</div>

			<div className="mx-auto mt-12 max-w-4xl space-y-4 text-[#14163A]/75">
				<h2 className="font-bold text-[#14163A] text-xl">Our story</h2>
				<p>
					{settings.shopName} grew out of a simple frustration: buying crackers online usually means paying city
					retail prices for products made a few streets away from us in Sivakasi. So we built an estimate-first
					buying experience — browse the full catalogue, see manufacturer pricing up front, and only commit once
					your estimate is confirmed over a phone call.
				</p>
				<p>
					Today we ship gift boxes, ground chakkars, flowerpots, sparklers, rockets, and family packs across Tamil
					Nadu and beyond, backed by repeat customers who keep coming back for the same fair rate, order after
					order.
				</p>
			</div>

			<div className="mx-auto mt-16 max-w-5xl">
				<h2 className="text-center font-bold text-[#14163A] text-xl">Our promise</h2>
				<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
					{PROMISES.map((item) => {
						const Icon = item.icon;
						return (
							<div key={item.title} className="flex gap-4 rounded-lg border border-[#14163A]/10 p-5">
								<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14163A]/5 text-[#C8202F]">
									<Icon className="h-5 w-5" />
								</span>
								<div>
									<h3 className="font-bold text-[#14163A]">{item.title}</h3>
									<p className="mt-1 text-[#14163A]/65 text-sm">{item.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="mx-auto mt-16 max-w-4xl rounded-lg bg-[#14163A]/5 p-6 text-[#14163A]/70 text-sm leading-relaxed">
				<p>
					As per the 2018 Supreme Court order, online sale of firecrackers is not permitted. We respect this
					jurisdiction fully: every order placed here starts as an estimate, which our team confirms with you by
					phone before any sale is finalised. We operate under all applicable explosives-licensing and statutory
					compliance requirements for our shop and godowns.
				</p>
			</div>
		</div>
	);
}