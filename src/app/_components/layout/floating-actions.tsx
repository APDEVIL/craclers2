import { Download } from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";

export interface FloatingActionsProps {
	whatsappNumber: string | null;
}

export function FloatingActions({ whatsappNumber }: FloatingActionsProps) {
	const waLink = whatsappNumber
		? `https://wa.me/91${whatsappNumber.replace(/\D/g, "")}`
		: null;

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between px-4 pb-4 sm:px-6">
			{waLink ? (
				<a
					aria-label="Chat with us on WhatsApp"
					className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
					href={waLink}
					rel="noopener noreferrer"
					target="_blank"
				>
					<WhatsAppIcon className="h-7 w-7" />
				</a>
			) : (
				<span />
			)}

			<div className="pointer-events-auto flex flex-col items-end gap-3">
				<a
					className="flex items-center gap-2 rounded-full bg-[#D9A640] px-4 py-2.5 font-bold text-[#14163A] text-sm shadow-lg transition hover:scale-105 hover:shadow-xl"
					href="/api/price-list/pdf"
				>
					<Download className="h-4 w-4" />
					Download price list
				</a>
				<Link
					className="flex items-center gap-2 rounded-full bg-[#C8202F] px-5 py-3 font-bold text-sm text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
					href="/estimate"
				>
					Estimate now
				</Link>
			</div>
		</div>
	);
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg fill="currentColor" viewBox="0 0 32 32" {...props}>
			<title>WhatsApp</title>
			<path d="M16.04 2.667C8.65 2.667 2.667 8.65 2.667 16.04c0 2.61.726 5.05 1.985 7.13L2.667 29.333l6.31-1.953a13.28 13.28 0 0 0 7.063 2.024c7.39 0 13.373-5.983 13.373-13.373S23.43 2.667 16.04 2.667Zm0 24.213a10.78 10.78 0 0 1-5.49-1.503l-.394-.234-3.74 1.157 1.184-3.64-.256-.374a10.79 10.79 0 0 1-1.65-5.746c0-5.98 4.866-10.846 10.846-10.846 5.98 0 10.846 4.866 10.846 10.846 0 5.98-4.866 10.84-10.846 10.84Zm5.94-8.12c-.325-.163-1.92-.946-2.218-1.054-.297-.108-.514-.163-.73.163-.216.325-.838 1.054-1.027 1.27-.19.217-.378.244-.703.082-1.9-.95-3.144-1.695-4.394-3.844-.332-.572.332-.532.95-1.77.108-.217.054-.406-.054-.572-.108-.163-.974-2.346-1.135-2.713-.16-.366-.325-.317-.514-.325-.163-.007-.35-.007-.54-.007-.19 0-.5.07-.76.35-.26.28-1 1.027-1 2.508 0 1.48 1.054 2.91 1.2 3.11.15.2 2.06 3.15 5.03 4.28 2.47.94 2.97.755 3.52.673.55-.082 1.92-.785 2.19-1.54.27-.756.27-1.403.19-1.54-.082-.135-.298-.217-.622-.38Z" />
		</svg>
	);
}
