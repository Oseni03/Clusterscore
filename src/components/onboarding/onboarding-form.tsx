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
				headers: { "Content-Type": "application/json" },
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
		<Card className="border-border/80 shadow-xl">
			<CardHeader className="text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
					<Logo className="h-8 w-8" />
				</div>
				<CardTitle className="text-3xl font-bold">
					Welcome to Clusterscore!
				</CardTitle>
				<CardDescription className="text-base mt-2">
					Let’s create your first workspace to get started
				</CardDescription>
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
												className="pl-10"
												{...field}
												onChange={(e) => {
													field.onChange(e);
													handleNameChange(
														e.target.value
													);
												}}
											/>
										</div>
									</FormControl>
									<FormDescription>
										This is your workspace’s display name
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
												className="pl-10 font-mono text-sm"
												{...field}
											/>
										</div>
									</FormControl>
									<FormDescription>
										Used in your workspace URL (lowercase,
										numbers, hyphens only)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="rounded-xl border bg-muted/40 p-5 text-sm">
							<p className="font-semibold text-foreground">
								What’s a workspace?
							</p>
							<p className="mt-2 text-muted-foreground">
								A workspace is where your team collaborates. You
								can invite members, connect integrations, and
								manage all your SaaS tools in one place.
							</p>
						</div>

						<Button
							type="submit"
							size="lg"
							className="w-full"
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
