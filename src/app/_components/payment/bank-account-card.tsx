"use client";

import { Check, Copy, Landmark } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export interface BankAccountCardData {
	bankName: string;
	accountHolderName: string;
	accountNumber: string;
	ifscCode: string;
	branchName: string | null;
}

export function BankAccountCard({ account }: { account: BankAccountCardData }) {
	return (
		<div className="rounded-xl border border-[#14163A]/10 bg-white p-6 shadow-sm">
			<div className="flex items-center gap-3">
				<span className="grid h-11 w-11 place-items-center rounded-full bg-[#14163A]/5 text-[#14163A]">
					<Landmark className="h-5 w-5" />
				</span>
				<h3 className="font-bold text-[#14163A] text-lg">{account.bankName}</h3>
			</div>

			<dl className="mt-5 space-y-3 text-sm">
				<Row label="Account holder" value={account.accountHolderName} />
				<Row label="Account number" value={account.accountNumber} copyable />
				<Row label="IFSC code" value={account.ifscCode} copyable />
				{account.branchName ? <Row label="Branch" value={account.branchName} /> : null}
			</dl>
		</div>
	);
}

function Row({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="flex items-center justify-between gap-3">
			<div>
				<dt className="text-[#14163A]/45 text-xs uppercase tracking-wide">{label}</dt>
				<dd className="font-semibold text-[#14163A]">{value}</dd>
			</div>
			{copyable ? (
				<Button size="icon" variant="ghost" onClick={handleCopy} aria-label={`Copy ${label}`}>
					{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-[#14163A]/50" />}
				</Button>
			) : null}
		</div>
	);
}