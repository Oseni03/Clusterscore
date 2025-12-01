"use client";

import { CreateOrganizationForm } from "@/components/forms/create-organization-form";

export default function CreateOrganizationPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-xl">
				<h1 className="text-2xl font-bold mb-4">
					Create your organization
				</h1>
				<p className="text-sm text-muted-foreground mb-6">
					Create your organization and choose a subscription plan. If
					this is your first organization, you can start with a free
					trial.
				</p>
				<CreateOrganizationForm />
			</div>
		</div>
	);
}
