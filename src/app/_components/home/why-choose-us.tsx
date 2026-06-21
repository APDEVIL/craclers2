const FEATURES = [
	{ title: "Attractive", description: "Crackers come in bright, eye-catching packaging that's a joy to unbox with the family." },
	{ title: "Manufacturing", description: "Our factory follows every government norm for manufacturing, using certified raw materials." },
	{ title: "Colourful", description: "Every category is prepared with a customer-first mindset — colourful, vivid displays guaranteed." },
	{ title: "Safety", description: "A dedicated quality-control team checks every batch so crackers stay safe for children and adults." },
	{ title: "Genuine price", description: "Manufacturer-direct pricing means repeat customers keep coming back for the same fair rate." },
	{ title: "Satisfaction", description: "We collect feedback after every order and keep improving — your satisfaction is the real goal." },
] as const;

export function WhyChooseUs() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
			<h2 className="text-center font-extrabold text-3xl text-[#14163A]">Why choose us?</h2>
			<p className="mx-auto mt-4 max-w-3xl text-center text-[#14163A]/65">
				We&apos;re a Sivakasi-based manufacturer shipping certified-quality crackers across Tamil Nadu and beyond,
				with an estimate-first buying experience that keeps pricing transparent from the very first click.
			</p>

			<div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((feature) => (
					<div key={feature.title} className="space-y-2">
						<span className="grid h-12 w-12 place-items-center rounded-full bg-[#14163A]/5 text-[#C8202F] text-xl">✺</span>
						<h3 className="font-bold text-[#14163A] text-lg">{feature.title}</h3>
						<p className="text-[#14163A]/65 text-sm leading-relaxed">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}