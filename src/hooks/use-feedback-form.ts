"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitFeedback } from "@/server/feedback";
import { authClient } from "@/lib/auth-client";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import { sendTelegramMessage } from "@/lib/telegram";

export type FeedbackFormValues = {
	title: string;
	details: string;
};

function formatTelegramFeedback(
	appName: string,
	userEmail: string,
	title: string,
	details: string
) {
	return `
<b>📝 New Feedback Received</b>

<b>App:</b> ${appName}
<b>User:</b> ${userEmail}

<b>Title:</b> ${title}

<b>Details:</b>
<pre>${details}</pre>
  `;
}

export function useFeedbackForm() {
	const { data: session } = authClient.useSession();
	const { activeOrganization } = useOrganizationStore((state) => state);

	const form = useForm<FeedbackFormValues>({
		defaultValues: {
			title: "",
			details: "",
		},
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = async (values: FeedbackFormValues) => {
		if (!session?.user || !activeOrganization) {
			throw new Error("User must be authenticated to submit feedback.");
		}

		setLoading(true);

		try {
			const result = await submitFeedback(
				activeOrganization.id,
				session.user.id,
				{
					title: values.title,
					details: values.details,
				}
			);

			if (result.success) {
				// --- SEND FEEDBACK TO TELEGRAM ---
				const formatted = formatTelegramFeedback(
					`Clusterscore - ${activeOrganization.name}`,
					session.user.email!,
					values.title,
					values.details
				);
				await sendTelegramMessage(formatted);

				toast.success("Thanks for your feedback!");
				form.reset();
			} else {
				toast.error(result.error || "Failed to submit feedback.");
			}
		} catch (error) {
			console.error("Feedback error:", error);
			toast.error("Something went wrong while submitting your feedback.");
		} finally {
			setLoading(false);
		}
	};

	return { form, onSubmit, loading };
}
