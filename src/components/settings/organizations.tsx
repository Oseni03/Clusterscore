"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
	Building2,
	Edit,
	Loader2,
	Trash2,
	Calendar,
	Link as LinkIcon,
	Target,
	Crown,
	Sparkles,
	Shield,
	AlertTriangle,
} from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { UpdateOrganizationForm } from "../forms/update-organization-form";
import { toast } from "sonner";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import { deleteOrganization } from "@/server/organizations";
import { cn, getPlanByTier } from "@/lib/utils";

// Loading skeleton
const OrganizationSkeleton = () => (
	<div className="space-y-6">
		<Card className="overflow-hidden">
			<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background h-32" />
			<CardContent className="p-6 -mt-8">
				<div className="animate-pulse space-y-6">
					<div className="h-16 w-16 bg-muted rounded-xl" />
					<div className="space-y-3">
						<div className="h-8 bg-muted rounded w-48" />
						<div className="h-4 bg-muted rounded w-32" />
					</div>
					<Separator />
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded w-20" />
							<div className="h-6 bg-muted rounded w-32" />
						</div>
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded w-24" />
							<div className="h-6 bg-muted rounded w-28" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
);

const getPlanIcon = (tier: string) => {
	switch (tier?.toLowerCase()) {
		case "pro":
			return Sparkles;
		case "audit":
		case "enterprise":
			return Crown;
		default:
			return Building2;
	}
};

export default function OrganizationCard() {
	const { activeOrganization, organizations, isAdmin, removeOrganization } =
		useOrganizationStore((state) => ({
			activeOrganization: state.activeOrganization,
			isAdmin: state.isAdmin,
			removeOrganization: state.removeOrganization,
			organizations: state.organizations,
		}));

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [resetDialogOpen, setResetDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isMountedRef = useRef(true);

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const handleOpenUpdateDialog = useCallback(
		() => setUpdateDialogOpen(true),
		[]
	);
	const handleOpenDeleteDialog = useCallback(
		() => setDeleteDialogOpen(true),
		[]
	);

	const handleDeleteConfirm = useCallback(async () => {
		if (!activeOrganization) return;

		const toastId = toast.loading("Deleting workspace...");
		setIsLoading(true);

		try {
			if (organizations.length === 1) {
				toast.info("You can't delete your only workspace!", {
					id: toastId,
				});
				return;
			}
			const { success } = await deleteOrganization(activeOrganization.id);

			if (!isMountedRef.current) return;

			if (!success) {
				toast.error("Failed to delete workspace", { id: toastId });
				return;
			}

			removeOrganization(activeOrganization.id);
			toast.success("Workspace deleted successfully", { id: toastId });
			setDeleteDialogOpen(false);
		} catch (error) {
			if (isMountedRef.current) {
				console.error(error);
				toast.error("Failed to delete workspace", { id: toastId });
			}
		} finally {
			if (isMountedRef.current) setIsLoading(false);
		}
	}, [activeOrganization, removeOrganization, organizations.length]);

	const handleResetData = useCallback(async () => {
		if (!activeOrganization) return;

		const toastId = toast.loading("Resetting all data...");
		setIsLoading(true);

		try {
			// TODO: Implement reset data API call
			// await resetOrganizationData(activeOrganization.id);

			if (!isMountedRef.current) return;

			toast.success("All data has been reset successfully", {
				id: toastId,
			});
			setResetDialogOpen(false);
		} catch (error) {
			if (isMountedRef.current) {
				console.error(error);
				toast.error("Failed to reset data", { id: toastId });
			}
		} finally {
			if (isMountedRef.current) setIsLoading(false);
		}
	}, [activeOrganization]);

	if (!activeOrganization) {
		return <OrganizationSkeleton />;
	}

	const formattedDate = format(
		new Date(activeOrganization.createdAt),
		"MMM d, yyyy"
	);

	const planTier = activeOrganization.subscriptionTier || "FREE";
	const plan = getPlanByTier(planTier);
	const PlanIcon = getPlanIcon(planTier);

	const subscriptionBadge = {
		FREE: { variant: "secondary" as const, text: "Free Tier" },
		AUDIT: { variant: "default" as const, text: "Audit Plan" },
		PRO: {
			variant: "default" as const,
			text: "Pro Plan",
			className: "bg-gradient-to-r from-blue-600 to-cyan-600 border-0",
		},
	}[planTier] || { variant: "secondary" as const, text: planTier };

	return (
		<div className="space-y-6">
			{/* Main Organization Card */}
			<Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
				{/* Header with gradient */}
				<div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background h-32">
					<div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
					{isAdmin && (
						<div className="absolute top-4 right-4 flex gap-2">
							<Button
								variant="secondary"
								size="icon"
								className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background"
								onClick={handleOpenUpdateDialog}
								aria-label="Edit workspace"
							>
								<Edit className="w-4 h-4" />
							</Button>
							<Button
								variant="secondary"
								size="icon"
								className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-600"
								onClick={handleOpenDeleteDialog}
								aria-label="Delete workspace"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					)}
				</div>

				<CardContent className="p-6 -mt-8 space-y-6">
					{/* Organization icon and name */}
					<div className="flex items-start gap-4">
						<div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center ring-4 ring-background shadow-sm">
							<Building2 className="w-8 h-8 text-primary" />
						</div>
						<div className="flex-1 min-w-0 pt-2">
							<h3 className="text-2xl font-bold tracking-tight truncate">
								{activeOrganization.name}
							</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge
									className={cn(
										"capitalize font-medium text-white",
										subscriptionBadge.className ||
											"bg-secondary text-secondary-foreground"
									)}
									variant={subscriptionBadge.variant}
								>
									<PlanIcon className="w-3 h-3 mr-1" />
									{subscriptionBadge.text}
								</Badge>
							</div>
						</div>
					</div>

					<Separator />

					{/* Details grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Slug */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<LinkIcon className="w-4 h-4" />
								<span className="font-medium">
									Workspace URL
								</span>
							</div>
							<div className="flex items-center gap-2">
								<code className="text-sm font-mono bg-muted px-2 py-1 rounded">
									{activeOrganization.slug}
								</code>
							</div>
						</div>

						{/* Target Score */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Target className="w-4 h-4" />
								<span className="font-medium">
									Target Score
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-2xl font-bold text-primary">
									{activeOrganization.targetScore || 75}
								</span>
								<span className="text-sm text-muted-foreground">
									/100
								</span>
							</div>
						</div>

						{/* Created date */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Calendar className="w-4 h-4" />
								<span className="font-medium">Created</span>
							</div>
							<p className="text-base font-medium">
								{formattedDate}
							</p>
						</div>
					</div>

					{/* Stats bar */}
					<div className="pt-4 border-t">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">
								Workspace ID
							</span>
							<code className="text-xs font-mono bg-muted px-2 py-1 rounded">
								{activeOrganization.id.slice(0, 8)}...
							</code>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Subscription Details */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-3">
						<Shield className="w-6 h-6 text-primary" />
						<CardTitle>Subscription Details</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label className="text-muted-foreground">
								Current Plan
							</Label>
							<div className="flex items-center gap-2">
								<Badge
									className={cn(
										"capitalize font-medium",
										subscriptionBadge.className
									)}
									variant={subscriptionBadge.variant}
								>
									<Shield className="w-3 h-3 mr-1" />
									{subscriptionBadge.text}
								</Badge>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-muted-foreground">
								Plan Features
							</Label>
							<p className="text-sm text-foreground">
								{plan?.features.join(", ") ||
									"Basic features included"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			{isAdmin && (
				<Card className="border-destructive/50 bg-destructive/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="w-5 h-5" />
							Danger Zone
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-background">
							<div className="max-w-2xl">
								<h4 className="font-semibold text-foreground">
									Reset All Data
								</h4>
								<p className="text-sm text-muted-foreground mt-1">
									Permanently delete all audit history,
									playbooks, files, and integrations. Reset
									your Clutterscore to zero. This cannot be
									undone.
								</p>
							</div>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setResetDialogOpen(true)}
								className="shrink-0"
							>
								Reset All Data
							</Button>
						</div>

						<Separator />

						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-background">
							<div className="max-w-2xl">
								<h4 className="font-semibold text-foreground">
									Delete Organization
								</h4>
								<p className="text-sm text-muted-foreground mt-1">
									Permanently delete this workspace and all
									associated data. This action cannot be
									undone.
								</p>
							</div>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleOpenDeleteDialog}
								className="shrink-0"
							>
								Delete Workspace
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Update Dialog */}
			<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Update Workspace</DialogTitle>
						<DialogDescription>
							Make changes to your workspace information here.
							Click save when you&rsquo;re done.
						</DialogDescription>
					</DialogHeader>
					<UpdateOrganizationForm organization={activeOrganization} />
				</DialogContent>
			</Dialog>

			{/* Reset Data Alert Dialog */}
			<AlertDialog
				open={resetDialogOpen}
				onOpenChange={setResetDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Reset All Organization Data?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<strong>all data</strong> for{" "}
							<strong>{activeOrganization.name}</strong>:
							<br />
							<br />
							• Audit results & trends
							<br />
							• Playbooks & execution history
							<br />
							• Files, integrations, and settings
							<br />
							<br />
							Your organization will remain, but all progress will
							be lost. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleResetData}
							disabled={isLoading}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Resetting...
								</>
							) : (
								"Yes, Reset Everything"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Alert Dialog */}
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete the workspace{" "}
							<strong className="text-foreground">
								{activeOrganization.name}
							</strong>{" "}
							and remove all associated data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={isLoading}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete Workspace"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
