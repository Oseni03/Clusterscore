import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getActiveOrganization } from "@/server/organizations";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	// Check if user already has an organization
	const organization = await getActiveOrganization(session.user.id);

	if (organization) {
		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
			<OnboardingForm user={session.user} />
		</div>
	);
}
