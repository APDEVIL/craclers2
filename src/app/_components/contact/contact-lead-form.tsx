"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export function ContactLeadForm() {
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");

	const submitMutation = api.lead.submit.useMutation();

	if (submitMutation.isSuccess) {
		return (
			<div className="flex flex-col items-center gap-3 rounded-lg bg-[#14163A]/5 px-6 py-10 text-center">
				<CheckCircle2 className="h-10 w-10 text-emerald-500" />
				<p className="font-bold text-[#14163A] text-lg">Thanks, {name.split(" ")[0]}!</p>
				<p className="text-[#14163A]/60 text-sm">We&apos;ll reach out on WhatsApp shortly.</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				submitMutation.mutate({ name, mobile, source: "contact_page" });
			}}
			className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2"
		>
			<div className="space-y-1.5">
				<Label htmlFor="contact-name">Your name *</Label>
				<Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" required />
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="contact-mobile">Mobile number *</Label>
				<Input
					id="contact-mobile"
					value={mobile}
					onChange={(e) => setMobile(e.target.value)}
					placeholder="Mobile number *"
					inputMode="tel"
					required
				/>
			</div>

			{submitMutation.error ? (
				<p className="col-span-full font-medium text-[#C8202F] text-sm">Something went wrong — please try again.</p>
			) : null}

			<div className="col-span-full flex justify-center">
				<Button type="submit" disabled={submitMutation.isPending} className="rounded-md bg-[#14163A] px-10 font-semibold hover:bg-[#1f2257]">
					{submitMutation.isPending ? "Submitting…" : "Submit"}
				</Button>
			</div>
		</form>
	);
}