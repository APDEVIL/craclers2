import "@/styles/globals.css";

import type { Metadata } from "next";
import { Baloo_2, Manrope } from "next/font/google";

import { AnnouncementBar } from "@/app/_components/layout/announcement-bar";
import { FloatingActions } from "@/app/_components/layout/floating-actions";
import { SiteFooter } from "@/app/_components/layout/site-footer";
import { SiteHeader } from "@/app/_components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";

const displayFont = Baloo_2({
	subsets: ["latin"],
	weight: ["600", "700", "800"],
	variable: "--font-display",
});

const bodyFont = Manrope({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Sri's Crackers Shop — Brighten your Diwali!",
	description:
		"Wholesale Sivakasi crackers at manufacturer-direct prices. Build your estimate online and we'll confirm your order over a phone call.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const settings = await api.settings.get();

	return (
		<html className={`${displayFont.variable} ${bodyFont.variable}`} lang="en">
			<body className="flex min-h-screen flex-col font-sans antialiased">
				<TRPCReactProvider>
					<AnnouncementBar text={settings.announcementText ?? ""} />
					<SiteHeader
						address={settings.address}
						contactPhonePrimary={settings.contactPhonePrimary}
						contactPhoneSecondary={settings.contactPhoneSecondary}
						mail={settings.contactEmail}
						shopName={settings.shopName}
					/>
					<main className="flex-1">{children}</main>
					<SiteFooter
						contactPhonePrimary={settings.contactPhonePrimary}
						contactPhoneSecondary={settings.contactPhoneSecondary}
						mail={settings.contactEmail}
						shopAddress={settings.shopAddress}
						shopName={settings.shopName}
					/>
					<FloatingActions whatsappNumber={settings.whatsappNumber} />
					<Toaster position="top-center" richColors />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
