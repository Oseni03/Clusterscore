import { redirect } from "next/navigation";

export default function SettingsPage() {
	// Redirect to the default settings page (integrations)
	redirect("/dashboard/settings/integrations");
}
