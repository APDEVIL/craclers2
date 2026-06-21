import { SettingsForm } from "@/app/_components/admin/settings-form";

export default function AdminSettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display font-extrabold text-2xl text-[#14163A]">Settings</h1>
				<p className="text-[#14163A]/55 text-sm">Manage shop info, announcement bar, and payment accounts.</p>
			</div>
			<SettingsForm />
		</div>
	);
}