import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Box, Info } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";

interface PlaybookCardProps {
	title: string;
	description: string;
	impact: string;
	impactType: "savings" | "security" | "efficiency";
	source: "slack" | "google" | "notion" | "dropbox";
	itemsCount: number;
	onApprove?: () => void;
	onDismiss?: () => void;
}

export function PlaybookCard({
	title,
	description,
	impact,
	impactType,
	source,
	itemsCount,
	onApprove,
	onDismiss,
}: PlaybookCardProps) {
	const [status, setStatus] = useState<"pending" | "approved" | "dismissed">(
		"pending"
	);

	const handleApprove = () => {
		setStatus("approved");
		onApprove?.();
	};

	const handleDismiss = () => {
		setStatus("dismissed");
		onDismiss?.();
	};

	if (status === "dismissed") return null;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="w-full"
		>
			{status === "approved" ? (
				<Card className="bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900">
					<CardContent className="p-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
								<Check className="h-5 w-5" />
							</div>
							<span className="font-medium text-green-800 dark:text-green-300">
								Cleanup scheduled successfully
							</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setStatus("pending")}
						>
							Undo
						</Button>
					</CardContent>
				</Card>
			) : (
				<Card className="group hover:shadow-md transition-all border-border/60 bg-card/50 backdrop-blur-sm">
					<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="capitalize font-mono text-xs bg-background"
							>
								{source}
							</Badge>
							<Badge
								variant="secondary"
								className={cn(
									"font-mono text-xs",
									impactType === "savings" &&
										"text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
									impactType === "security" &&
										"text-destructive bg-red-50 dark:bg-red-900/20",
									impactType === "efficiency" &&
										"text-blue-600 bg-blue-50 dark:bg-blue-900/20"
								)}
							>
								{impact}
							</Badge>
						</div>
						<span className="text-xs text-muted-foreground font-mono">
							{itemsCount} items
						</span>
					</CardHeader>
					<CardContent>
						<h3 className="font-semibold text-lg mb-1">{title}</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{description}
						</p>
					</CardContent>
					<CardFooter className="flex justify-between gap-2 pt-0">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground"
							onClick={handleDismiss}
						>
							Dismiss
						</Button>
						<div className="flex gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										Details
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[600px]">
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2">
											{title}
											<Badge
												variant="outline"
												className="ml-2 font-normal text-xs"
											>
												{source}
											</Badge>
										</DialogTitle>
										<DialogDescription>
											Review the items that will be
											affected by this cleanup action.
										</DialogDescription>
									</DialogHeader>

									<div className="py-4">
										<div className="bg-muted/50 p-4 rounded-lg mb-6 border border-border/50">
											<div className="flex items-center gap-2 text-sm font-medium mb-2">
												<Info className="h-4 w-4 text-primary" />
												Impact Analysis
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">
														Est. Savings:
													</span>
													<div className="font-mono font-bold text-emerald-600">
														{impact}
													</div>
												</div>
												<div>
													<span className="text-muted-foreground">
														Items Affected:
													</span>
													<div className="font-mono font-bold">
														{itemsCount}
													</div>
												</div>
											</div>
										</div>

										<div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
											<h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background pb-2">
												Sample Items
											</h4>
											{[1, 2, 3, 4, 5].map((i) => (
												<div
													key={i}
													className="flex items-center justify-between p-3 rounded border border-border/40 bg-card"
												>
													<div className="flex items-center gap-3">
														<div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
															<Box className="h-4 w-4 text-muted-foreground" />
														</div>
														<div>
															<div className="text-sm font-medium">
																Sample_Item_{i}
																.dat
															</div>
															<div className="text-xs text-muted-foreground">
																Last accessed 14
																months ago
															</div>
														</div>
													</div>
													<Badge
														variant="secondary"
														className="text-[10px]"
													>
														1.2 MB
													</Badge>
												</div>
											))}
											<div className="text-center text-xs text-muted-foreground pt-2">
												+ {itemsCount - 5} more items
											</div>
										</div>
									</div>

									<DialogFooter className="gap-2 sm:justify-between">
										<DialogClose asChild>
											<Button variant="ghost">
												Cancel
											</Button>
										</DialogClose>
										<Button
											onClick={handleApprove}
											className="bg-primary"
										>
											Run Cleanup Playbook{" "}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Button
								size="sm"
								onClick={handleApprove}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								Clean Now{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</CardFooter>
				</Card>
			)}
		</motion.div>
	);
}
