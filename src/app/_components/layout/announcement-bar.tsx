import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
	text: string;
	className?: string;
}

export function AnnouncementBar({ text, className }: AnnouncementBarProps) {
	if (!text) return null;

	return (
		<div
			className={cn(
				"relative overflow-hidden bg-[#C8202F] py-2 text-white",
				className,
			)}
			role="status"
		>
			<style>{`
				@keyframes ss-marquee {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
			`}</style>
			<div className="flex w-max animate-[ss-marquee_22s_linear_infinite] gap-16 whitespace-nowrap px-4 font-semibold text-sm tracking-wide motion-reduce:animate-none">
				<span>{text}</span>
				<span aria-hidden="true">{text}</span>
			</div>
		</div>
	);
}
