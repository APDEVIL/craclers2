"use client";

import { Mail, MapPin, Menu, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/estimate", label: "Estimate" },
    { href: "/payment", label: "Payment" },
    { href: "/about-us", label: "About us" },
    { href: "/contact-us", label: "Contact us" },
] as const;

export interface SiteHeaderProps {
    shopName: string;
    address: string | null;
    mail: string | null;
    contactPhonePrimary: string | null;
    contactPhoneSecondary: string | null;
}

export function SiteHeader(props: SiteHeaderProps) {
    const pathname = usePathname();
    const phones = [props.contactPhonePrimary, props.contactPhoneSecondary].filter(
        (p): p is string => Boolean(p),
    );

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            <div className="hidden border-[#14163A]/10 border-b bg-[#14163A] text-white lg:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2.5 text-sm">
                    {props.address ? (
                        <div className="flex items-center gap-2 text-white/85">
                            <MapPin className="h-4 w-4 shrink-0 text-[#D9A640]" />
                            <span>{props.address}</span>
                        </div>
                    ) : (
                        <span />
                    )}
                    <div className="flex items-center gap-6">
                        {props.mail ? (
                            <a
                                href={`mailto:${props.mail}`}
                                className="flex items-center gap-2 text-white/85 transition hover:text-white"
                            >
                                <Mail className="h-4 w-4 text-[#D9A640]" />
                                {props.mail}
                            </a>
                        ) : null}
                        {phones.length > 0 ? (
                            <div className="flex items-center gap-2 text-white/85">
                                <Phone className="h-4 w-4 shrink-0 text-[#D9A640]" />
                                <span className="flex gap-1">
                                    {phones.map((phone, i) => (
                                        <a key={phone} href={`tel:${phone}`} className="transition hover:text-white">
                                            {phone}
                                            {i < phones.length - 1 ? "," : ""}
                                        </a>
                                    ))}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
                <Link href="/" className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-[#14163A] font-bold text-[#D9A640] text-lg">
                        SS
                    </span>
                    <span className="leading-tight">
                        <span className="block font-extrabold text-[#14163A] text-lg tracking-tight">
                            {props.shopName}
                        </span>
                        <span className="block font-medium text-[#C8202F] text-xs">
                            Brighten your Diwali!
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "font-semibold text-sm transition-colors",
                                    isActive ? "text-[#C8202F]" : "text-[#14163A]/70 hover:text-[#14163A]",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden lg:block">
                    <Button asChild className="rounded-full bg-[#14163A] px-6 font-semibold text-white hover:bg-[#1f2257]">
                        <Link href="/estimate#price-list">Price list</Link>
                    </Button>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                            <Menu className="h-6 w-6 text-[#14163A]" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <nav className="mt-10 flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "rounded-md px-3 py-2.5 font-semibold text-base transition-colors",
                                            pathname === link.href
                                                ? "bg-[#14163A]/5 text-[#C8202F]"
                                                : "text-[#14163A] hover:bg-[#14163A]/5",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                            <SheetClose asChild>
                                <Button asChild className="mt-3 rounded-full bg-[#14163A] font-semibold text-white hover:bg-[#1f2257]">
                                    <Link href="/estimate#price-list">Price list</Link>
                                </Button>
                            </SheetClose>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}