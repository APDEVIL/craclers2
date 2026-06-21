import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/estimate", label: "Estimate" },
	{ href: "/about-us", label: "About us" },
	{ href: "/contact-us", label: "Contact us" },
	{ href: "/payment", label: "Payment" },
] as const;

export interface SiteFooterProps {
	shopName: string;
	shopAddress: string | null;
	mail: string | null;
	contactPhonePrimary: string | null;
	contactPhoneSecondary: string | null;
}

export function SiteFooter(props: SiteFooterProps) {
	const year = new Date().getFullYear();
	const phones = [props.contactPhonePrimary, props.contactPhoneSecondary].filter(
		(p): p is string => Boolean(p),
	);

	return (
		<footer className="bg-[#14163A] text-white">
			<div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-1">
					<div className="flex items-center gap-3">
						<span className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-lg font-bold text-[#D9A640]">
							SS
						</span>
						<span className="leading-tight">
							<span className="block text-lg font-extrabold tracking-tight">{props.shopName}</span>
							<span className="block text-xs font-medium text-[#D9A640]">Brighten your Diwali!</span>
						</span>
					</div>
					<p className="text-sm leading-relaxed text-white/65">
						As per the 2018 Supreme Court order, online sale of firecrackers is not
						permitted. Estimates submitted here are confirmed over a phone call before
						any order is finalised — we follow every explosives-licensing and
						statutory compliance that applies to our shop and godowns.
					</p>
				</div>

				<div>
					<h3 className="text-sm font-bold uppercase tracking-wider text-[#D9A640]">Quick links</h3>
					<ul className="mt-4 space-y-2.5">
						{QUICK_LINKS.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="text-sm text-white/75 transition hover:text-white">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="text-sm font-bold uppercase tracking-wider text-[#D9A640]">For more</h3>
					<ul className="mt-4 space-y-3.5 text-sm text-white/75">
						{props.shopAddress ? (
							<li className="flex items-start gap-2.5">
								<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A640]" />
								<span>{props.shopAddress}</span>
							</li>
						) : null}
						{props.mail ? (
							<li className="flex items-center gap-2.5">
								<Mail className="h-4 w-4 shrink-0 text-[#D9A640]" />
								<a href={`mailto:${props.mail}`} className="hover:text-white">
									{props.mail}
								</a>
							</li>
						) : null}
						{phones.length > 0 ? (
							<li className="flex items-center gap-2.5">
								<Phone className="h-4 w-4 shrink-0 text-[#D9A640]" />
								<span className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
									{phones.map((phone) => (
										<a key={phone} href={`tel:${phone}`} className="hover:text-white">
											{phone}
										</a>
									))}
								</span>
							</li>
						) : null}
					</ul>
				</div>
			</div>

			<div className="border-t border-white/10 px-6 py-5">
				<p className="mx-auto max-w-7xl text-center text-xs text-white/55">
					© {year} {props.shopName}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}