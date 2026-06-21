"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

const DISMISSED_KEY = "ss_lead_popup_dismissed";
const SHOW_DELAY_MS = 3000;

export function LeadCaptureDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");

	const submitMutation = api.lead.submit.useMutation({
		onSuccess: () => {
			sessionStorage.setItem(DISMISSED_KEY, "1");
			setOpen(false);
		},
	});

	useEffect(() => {
		if (sessionStorage.getItem(DISMISSED_KEY)) return;
		const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
		return () => clearTimeout(timer);
	}, []);

	const handleOpenChange = (next: boolean) => {
		if (!next) sessionStorage.setItem(DISMISSED_KEY, "1");
		setOpen(next);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-[#C8202F]">
						To know more about offers and discounts
					</DialogTitle>
					<DialogDescription>
						Leave your number and we&apos;ll let you know the moment a new
						discount goes live.
					</DialogDescription>
				</DialogHeader>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						submitMutation.mutate({ name, mobile });
					}}
				>
					<div className="space-y-1.5">
						<Label htmlFor="lead-name">Name</Label>
						<Input
							id="lead-name"
							onChange={(e) => setName(e.target.value)}
							placeholder="Name *"
							required
							value={name}
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="lead-mobile">Mobile number</Label>
						<Input
							id="lead-mobile"
							inputMode="tel"
							onChange={(e) => setMobile(e.target.value)}
							placeholder="Your phone number *"
							required
							value={mobile}
						/>
					</div>

					{submitMutation.error ? (
						<p className="font-medium text-[#C8202F] text-sm">
							Something went wrong — please try again.
						</p>
					) : null}

					<Button
						className="w-full bg-[#14163A] font-semibold hover:bg-[#1f2257]"
						disabled={submitMutation.isPending}
						type="submit"
					>
						{submitMutation.isPending ? "Submitting…" : "Submit"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
