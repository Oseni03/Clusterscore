"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Building2, Edit, Loader2, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { UpdateOrganizationForm } from "../forms/update-organization-form";
import { toast } from "sonner";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import { deleteOrganization } from "@/server/organizations";

// Loading skeleton
const OrganizationSkeleton = () => (
	<Card className="shadow-sm">
		<CardContent className="p-6">
			<div className="animate-pulse space-y-4">
				<div className="h-8 bg-muted rounded w-48"></div>
				<div className="space-y-2">
					<div className="h-4 bg-muted rounded w-32"></div>
					<div className="h-5 bg-muted rounded w-40"></div>
				</div>
				<div className="space-y-2">
					<div className="h-4 bg-muted rounded w-32"></div>
					<div className="h-5 bg-muted rounded w-36"></div>
				</div>
			</div>
		</CardContent>
	</Card>
);

// Reusable info field
const InfoField = ({ label, value }: { label: string; value: string }) => (
	<div className="space-y-1">
		<p className="text-sm font-medium text-muted-foreground">{label}</p>
		<p className="text-base font-medium break-words">{value}</p>
	</div>
);

export default function OrganizationCard() {
	const { activeOrganization, isAdmin, removeOrganization } =
		useOrganizationStore((state) => ({
			activeOrganization: state.activeOrganization,
			isAdmin: state.isAdmin,
			removeOrganization: state.removeOrganization,
		}));

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
			const { data, success } = await deleteOrganization(
				activeOrganization.id
			);

			if (!isMountedRef.current) return;

			if (!success || !data) {
				toast.error("Failed to delete workspace", { id: toastId });
				return;
			}

			removeOrganization(data.id);
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
	}, [activeOrganization, removeOrganization]);

	// Safe guard: show skeleton while loading or no organization
	if (!activeOrganization) {
		return <OrganizationSkeleton />;
	}

	const formattedDate = format(
		new Date(activeOrganization.createdAt),
		"MMMM d, yyyy"
	);

	return (
		<div className="space-y-6">
			<Card className="shadow-sm">
				<div className="p-6 border-b border-muted">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Building2 className="w-5 h-5" />
							Workspace Information
						</h3>
						{isAdmin && (
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={handleOpenUpdateDialog}
									aria-label="Edit workspace"
								>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleOpenDeleteDialog}
									className="hover:bg-red-50 hover:text-red-600"
									aria-label="Delete workspace"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						)}
					</div>
				</div>

				<CardContent className="p-4 sm:p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<InfoField
							label="Name"
							value={activeOrganization.name}
						/>
						<InfoField
							label="Slug"
							value={activeOrganization.slug}
						/>
						<InfoField label="Created" value={formattedDate} />
					</div>
				</CardContent>
			</Card>

			{/* Update Dialog */}
			<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
				<DialogContent>
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
							<strong>{activeOrganization.name}</strong> and
							remove all associated data.
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
