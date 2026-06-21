"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

interface Slide {
	eyebrow: string;
	headline: string;
	subhead: string;
	tone: "gold" | "red" | "navy";
}

const SLIDES: Slide[] = [
	{
		eyebrow: "Diwali specials",
		headline: "Light up your Diwali with SS Crackers Shop",
		subhead:
			"Sivakasi-manufactured crackers at honest, manufacturer-direct prices.",
		tone: "gold",
	},
	{
		eyebrow: "Gift boxes",
		headline: "Curated gift boxes for every budget",
		subhead:
			"From starter packs to family-sized hampers — all in one estimate.",
		tone: "red",
	},
	{
		eyebrow: "Quality assured",
		headline: "Certified materials, every single cracker",
		subhead: "Strict factory norms, safe for the whole family to enjoy.",
		tone: "navy",
	},
];

const TONE_BG: Record<Slide["tone"], string> = {
	gold: "bg-gradient-to-br from-[#D9A640] via-[#e8bc66] to-[#C8202F]",
	red: "bg-gradient-to-br from-[#C8202F] via-[#a81b27] to-[#14163A]",
	navy: "bg-gradient-to-br from-[#14163A] via-[#1f2257] to-[#D9A640]",
};

export function HeroCarousel() {
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReducedMotion) return;
		const interval = setInterval(() => api.scrollNext(), 5500);
		return () => clearInterval(interval);
	}, [api]);

	return (
		<Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
			<CarouselContent>
				{SLIDES.map((slide) => (
					<CarouselItem key={slide.headline}>
						<div
							className={`relative flex min-h-[420px] items-center overflow-hidden ${TONE_BG[slide.tone]} px-6 py-16 sm:px-12`}
						>
							<BurstDecoration />
							<div className="relative z-10 max-w-xl space-y-5">
								<span className="inline-block rounded-full bg-white/15 px-4 py-1 font-bold text-white text-xs uppercase tracking-wider">
									{slide.eyebrow}
								</span>
								<h1 className="font-extrabold text-3xl text-white leading-tight sm:text-5xl">
									{slide.headline}
								</h1>
								<p className="text-base text-white/85 sm:text-lg">
									{slide.subhead}
								</p>
								<div className="flex flex-wrap gap-3 pt-2">
									<Button
										asChild
										className="rounded-full bg-white font-bold text-[#14163A] hover:bg-white/90"
										size="lg"
									>
										<Link href="/estimate">Estimate now</Link>
									</Button>
									<Button
										asChild
										className="rounded-full border-white/60 bg-transparent font-bold text-white hover:bg-white/10"
										size="lg"
										variant="outline"
									>
										<Link href="/estimate#price-list">View price list</Link>
									</Button>
								</div>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

function BurstDecoration() {
	const lineCount = 16;
	const lines = Array.from({ length: lineCount }, (_, i) => {
		const angle = (i * Math.PI) / 8;
		return {
			angle,
			x2: 100 + 95 * Math.cos(angle),
			y2: 100 + 95 * Math.sin(angle),
		};
	});

	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute top-1/2 -right-10 h-[420px] w-[420px] -translate-y-1/2 opacity-20"
			viewBox="0 0 200 200"
		>
			{lines.map((line) => (
				<line
					key={line.angle}
					stroke="white"
					strokeLinecap="round"
					strokeWidth="3"
					x1="100"
					x2={line.x2}
					y1="100"
					y2={line.y2}
				/>
			))}
			<circle cx="100" cy="100" fill="white" r="22" />
		</svg>
	);
}
