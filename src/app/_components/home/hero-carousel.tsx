"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

interface Slide {
    eyebrow: string;
    headline: string;
    subhead: string;
}

const SLIDES: Slide[] = [
    {
        eyebrow: "Diwali specials",
        headline: "Light up your Diwali with SS Crackers Shop",
        subhead: "Sivakasi-manufactured crackers at honest, manufacturer-direct prices.",
    },
    {
        eyebrow: "Gift boxes",
        headline: "Curated gift boxes for every budget",
        subhead: "From starter packs to family-sized hampers — all in one estimate.",
    },
    {
        eyebrow: "Quality assured",
        headline: "Certified materials, every single cracker",
        subhead: "Strict factory norms, safe for the whole family to enjoy.",
    },
];

// Pre-calculate decorative line positions with stable string IDs outside the component
const BURST_LINES = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8;
    return {
        id: `burst-line-${i}`,
        x2: 100 + 90 * Math.cos(angle),
        y2: 100 + 90 * Math.sin(angle),
    };
});

export function HeroCarousel() {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const interval = setInterval(() => api.scrollNext(), 5500);
        return () => clearInterval(interval);
    }, [api]);

    return (
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
                {SLIDES.map((slide) => (
                    <CarouselItem key={slide.headline}>
                        <div className="relative grid min-h-[380px] items-center gap-10 overflow-hidden bg-secondary px-6 py-14 sm:px-12 lg:grid-cols-2 lg:py-20">
                            <div className="relative z-10 max-w-xl space-y-5">
                                <span className="inline-block rounded-full bg-accent/20 px-4 py-1 font-bold text-foreground text-xs uppercase tracking-wider">
                                    {slide.eyebrow}
                                </span>
                                <h1 className="font-extrabold text-3xl text-foreground leading-tight sm:text-5xl">
                                    {slide.headline}
                                </h1>
                                <p className="text-base text-foreground/70 sm:text-lg">{slide.subhead}</p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Button asChild className="rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90" size="lg">
                                        <Link href="/estimate">Estimate now</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="rounded-full border-foreground/25 bg-transparent font-bold text-foreground hover:bg-foreground/5"
                                        size="lg"
                                        variant="outline"
                                    >
                                        <Link href="/estimate#price-list">View price list</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative hidden items-center justify-center lg:flex">
                                <BurstDecoration />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

function BurstDecoration() {
    return (
        <svg aria-hidden="true" className="h-72 w-72" viewBox="0 0 200 200">
            {BURST_LINES.map((line) => (
                <line
                    key={line.id}
                    stroke="var(--foreground)"
                    strokeLinecap="round"
                    strokeOpacity="0.15"
                    strokeWidth="3"
                    x1="100"
                    x2={line.x2}
                    y1="100"
                    y2={line.y2}
                />
            ))}
            <circle cx="100" cy="100" fill="var(--brand-gold)" r="34" />
            <circle cx="100" cy="100" fill="var(--brand-maroon)" r="14" />
        </svg>
    );
}