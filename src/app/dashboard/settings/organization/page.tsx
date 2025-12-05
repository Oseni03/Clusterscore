import OrganizationCard from "@/components/settings/organizations";

export default function OrganizationPage() {
	return (
		<div className="w-full flex justify-center">
			<div className="w-full max-w-6xl p-6 space-y-6">
				<div className="mb-8">
					<h1 className="text-2xl font-display font-bold">
						Organization Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your organization details and preferences.
					</p>
				</div>

				<OrganizationCard />
			</div>
		</div>
	);
}
