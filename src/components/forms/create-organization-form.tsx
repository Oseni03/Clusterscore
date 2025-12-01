"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "../ui/dialog";
import { createOrganization } from "@/server/organizations";
import { SUBSCRIPTION_PLANS } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import { useRouter } from "next/navigation";
import { Organization } from "@/types";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	slug: z.string().min(2).max(50),
	planProductId: z.string().optional(),
	trial: z.boolean().optional(),
});

export function CreateOrganizationForm() {
	const { data } = authClient.useSession();
	const { addOrganization } = useOrganizationStore((state) => state);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const user = data?.user;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			planProductId: SUBSCRIPTION_PLANS[0]?.productId || "",
			trial: true,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			toast.loading("Creating Workspace...");
			setIsLoading(true);

			if (!user) return;

			const payload = {
				name: values.name,
				slug: values.slug,
				productId: values.planProductId,
				trial: !!values.trial,
			};

			const { data, success } = await createOrganization(
				user.id,
				payload
			);

			if (!data || !success) {
				toast.dismiss();
				toast.error("Failed to create workspace");
				return;
			}

			addOrganization(data as Organization);
			toast.dismiss();

			const selectedProductId = payload.productId;

			if (selectedProductId) {
				// Paid plan selected — initiate checkout and redirect
				try {
					toast.loading("Creating checkout session...");
					const productIds = [selectedProductId].filter(Boolean);
					const { data: checkoutData, error } =
						await authClient.checkout({
							products: productIds,
							referenceId: data.id,
							allowDiscountCodes: true,
						});
					if (error) throw new Error(error.message);
					if (checkoutData?.url) {
						toast.dismiss();
						window.location.href = checkoutData.url;
						return;
					}
					toast.dismiss();
					toast.error(
						"Failed to start checkout. Redirecting to dashboard."
					);
					router.push("/dashboard");
					return;
				} catch (err) {
					console.error("Checkout initiation failed:", err);
					toast.dismiss();
					toast.error(
						"Failed to start checkout. Redirecting to dashboard."
					);
					router.push("/dashboard");
					return;
				}
			} else {
				toast.success("Organization created successfully");
				// After creating organization and subscription, redirect to dashboard
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
			toast.dismiss();
			toast.error("Failed to create workspace");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="My Workspace" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input placeholder="my-workspace" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Plan selection */}
				<FormField
					control={form.control}
					name="planProductId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subscription Plan</FormLabel>
							<FormControl>
								<RadioGroup
									value={field.value}
									onValueChange={field.onChange}
									aria-label="Subscription plan"
									className="grid grid-cols-1 sm:grid-cols-2 gap-4"
								>
									{SUBSCRIPTION_PLANS.map((plan) => (
										<label
											key={plan.id}
											className={`cursor-pointer transition-all rounded-lg border-2 p-4 ${
												field.value === plan.productId
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											}`}
										>
											<div className="flex items-start gap-3">
												<RadioGroupItem
													value={plan.productId}
													className="mt-1"
												/>
												<div className="flex-1">
													<div className="font-semibold">
														{plan.name}
													</div>
													<div className="text-sm text-muted-foreground mb-2">
														{plan.description}
													</div>
													<div className="text-lg font-bold mb-3">
														{plan.price}
														<span className="text-sm font-normal text-muted-foreground">
															{plan.period}
														</span>
													</div>
													<div className="space-y-1">
														{plan.features.map(
															(feature, idx) => (
																<div
																	key={idx}
																	className="text-sm flex items-start gap-2"
																>
																	<span className="text-primary mt-1">
																		✓
																	</span>
																	<span>
																		{
																			feature
																		}
																	</span>
																</div>
															)
														)}
													</div>
												</div>
											</div>
										</label>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>{" "}
				<FormField
					control={form.control}
					name="trial"
					render={({ field }) => (
						<FormItem className="flex items-center gap-2">
							<FormControl>
								<Checkbox
									checked={!!field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="m-0">
								Start trial (first workspace only)
							</FormLabel>
						</FormItem>
					)}
				/>
				<DialogFooter>
					<Button disabled={isLoading} type="submit">
						Create Workspace
						{isLoading && (
							<Loader2 className="size-4 animate-spin" />
						)}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
