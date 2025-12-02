"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Logo from "@/components/logo";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Workspace name must be at least 2 characters")
		.max(50, "Workspace name must be less than 50 characters"),
	slug: z
		.string()
		.min(2, "Slug must be at least 2 characters")
		.max(30, "Slug must be less than 30 characters")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens"
		),
});

interface OnboardingFormProps {
	user: {
		id: string;
		email: string;
		name?: string;
	};
}

export function OnboardingForm({ user }: OnboardingFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const defaultSlug = user.email
		.split("@")[0]
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name || user.email.split("@")[0],
			slug: defaultSlug,
		},
	});

	// Auto-generate slug from name
	const handleNameChange = (name: string) => {
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.substring(0, 30);
		form.setValue("slug", slug);
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);

			const response = await fetch("/api/organizations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: values.name,
					slug: values.slug,
					userId: user.id,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create workspace");
			}

			toast.success("Workspace created successfully!");
			router.push("/dashboard");
			router.refresh();
		} catch (error) {
			console.error("Error creating workspace:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to create workspace"
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-lg border-muted shadow-lg">
			<CardHeader className="space-y-4 text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Logo className="h-6 w-6" />
				</div>
				<div className="space-y-2">
					<CardTitle className="text-2xl font-bold">
						Welcome to Clusterscore! 🎉
					</CardTitle>
					<CardDescription className="text-base">
						Let&apos;s create your first workspace to get started
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Workspace Name</FormLabel>
									<FormControl>
										<div className="relative">
											<Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="Acme Inc."
												{...field}
												onChange={(e) => {
													field.onChange(e);
													handleNameChange(
														e.target.value
													);
												}}
												className="pl-9"
											/>
										</div>
									</FormControl>
									<FormDescription>
										This is your workspace&apos;s visible
										name
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Workspace URL</FormLabel>
									<FormControl>
										<div className="relative">
											<Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												placeholder="acme-inc"
												{...field}
												className="pl-9 font-mono text-sm"
											/>
										</div>
									</FormControl>
									<FormDescription>
										Used in your workspace URL. Only
										lowercase letters, numbers, and hyphens.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="rounded-lg border border-muted bg-muted/50 p-4">
							<p className="text-sm text-muted-foreground">
								<span className="font-semibold text-foreground">
									What&apos;s a workspace?
								</span>
								<br />A workspace is where your team
								collaborates. You can invite members, manage
								integrations, and track your SaaS tools all in
								one place.
							</p>
						</div>

						<Button
							type="submit"
							className="w-full"
							size="lg"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating workspace...
								</>
							) : (
								"Create Workspace"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
