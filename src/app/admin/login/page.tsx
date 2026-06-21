"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/server/better-auth/client";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error: signInError } = await authClient.signIn.email({
			email,
			password,
		});

		setLoading(false);
		if (signInError) {
			setError(signInError.message ?? "Invalid email or password");
			return;
		}

		router.push("/admin");
		router.refresh();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#F7F7FB] px-4">
			<form
				className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-md"
				onSubmit={handleSubmit}
			>
				<div className="text-center">
					<span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-[#14163A] font-bold text-[#D9A640] text-base">
						SS
					</span>
					<h1 className="mt-3 font-extrabold text-[#14163A] text-xl">
						Admin sign in
					</h1>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						required
						type="email"
						value={email}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						required
						type="password"
						value={password}
					/>
				</div>

				{error ? (
					<p className="font-medium text-[#C8202F] text-sm">{error}</p>
				) : null}

				<Button
					className="w-full bg-[#14163A] font-semibold hover:bg-[#1f2257]"
					disabled={loading}
					type="submit"
				>
					{loading ? "Signing in…" : "Sign in"}
				</Button>
			</form>
		</div>
	);
}
