import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	Slack,
	Database,
	Trello,
	Github,
	Save,
	CheckCircle2,
	CreditCard,
	Receipt,
	Download,
	RefreshCw,
	Plug,
	Trash2,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
	return (
		<div className="p-6 space-y-6 mx-auto">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-display font-bold">
						Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your integrations and preferences.
					</p>
				</div>
				<Button>
					<Save className="mr-2 h-4 w-4" />
					Save Changes
				</Button>
			</div>

			<Tabs defaultValue="integrations" className="space-y-6">
				<TabsList>
					<TabsTrigger value="integrations">Integrations</TabsTrigger>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="notifications">
						Notifications
					</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
				</TabsList>

				<TabsContent value="integrations" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Connected Apps</CardTitle>
							<CardDescription>
								Manage the tools Clutterscore has access to.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{[
								{
									name: "Google Workspace",
									status: "Connected",
									icon: Database,
									lastSync: "10 mins ago",
									permissions: [
										"Drive Read/Write",
										"Admin Directory",
										"Gmail Metadata",
									],
								},
								{
									name: "Slack",
									status: "Connected",
									icon: Slack,
									lastSync: "1 hour ago",
									permissions: [
										"Channels Read",
										"Users Read",
										"Message Metadata",
									],
								},
								{
									name: "Dropbox",
									status: "Disconnected",
									icon: Database,
									lastSync: "Never",
									permissions: [],
								},
								{
									name: "Notion",
									status: "Connected",
									icon: Trello,
									lastSync: "2 hours ago",
									permissions: ["Pages Read", "Users Read"],
								},
								{
									name: "GitHub",
									status: "Disconnected",
									icon: Github,
									lastSync: "Never",
									permissions: [],
								},
							].map((app, i) => (
								<div
									key={i}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-4">
										<div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
											<app.icon className="h-5 w-5" />
										</div>
										<div>
											<div className="font-medium">
												{app.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{app.status === "Connected"
													? `Last synced ${app.lastSync}`
													: "Not connected"}
											</div>
										</div>
									</div>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant={
													app.status === "Connected"
														? "outline"
														: "default"
												}
												size="sm"
											>
												{app.status === "Connected"
													? "Manage"
													: "Connect"}
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle className="flex items-center gap-2">
													<app.icon className="h-5 w-5" />
													{app.name} Settings
												</DialogTitle>
												<DialogDescription>
													Configure synchronization
													and permission settings for{" "}
													{app.name}.
												</DialogDescription>
											</DialogHeader>

											{app.status === "Connected" ? (
												<div className="space-y-6 py-4">
													<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:bg-emerald-900/20 dark:border-emerald-900">
														<div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
															<CheckCircle2 className="h-4 w-4" />
															Integration Active
														</div>
														<p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1">
															Last synchronized{" "}
															{app.lastSync}
														</p>
													</div>

													<div className="space-y-3">
														<h4 className="text-sm font-medium">
															Active Permissions
														</h4>
														<div className="grid gap-2">
															{app.permissions.map(
																(perm) => (
																	<div
																		key={
																			perm
																		}
																		className="flex items-center justify-between text-sm border p-2 rounded bg-card"
																	>
																		<span>
																			{
																				perm
																			}
																		</span>
																		<Badge
																			variant="secondary"
																			className="text-[10px]"
																		>
																			Granted
																		</Badge>
																	</div>
																)
															)}
														</div>
													</div>

													<div className="space-y-3">
														<h4 className="text-sm font-medium">
															Sync Settings
														</h4>
														<div className="flex items-center justify-between">
															<Label
																htmlFor="auto-sync"
																className="font-normal"
															>
																Auto-sync every
																24h
															</Label>
															<Switch
																id="auto-sync"
																defaultChecked
															/>
														</div>
														<div className="flex items-center justify-between">
															<Label
																htmlFor="index-content"
																className="font-normal"
															>
																Index file
																content
															</Label>
															<Switch
																id="index-content"
																defaultChecked
															/>
														</div>
													</div>
												</div>
											) : (
												<div className="py-8 text-center space-y-4">
													<div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center">
														<Plug className="h-6 w-6 text-muted-foreground" />
													</div>
													<div>
														<h3 className="font-medium">
															Connect {app.name}
														</h3>
														<p className="text-sm text-muted-foreground max-w-[260px] mx-auto mt-1">
															Grant read-only
															access to allow
															Clutterscore to
															audit your
															workspace.
														</p>
													</div>
												</div>
											)}

											<DialogFooter className="sm:justify-between gap-2">
												{app.status === "Connected" ? (
													<>
														<Button
															variant="ghost"
															className="text-destructive hover:text-destructive hover:bg-destructive/10"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Disconnect
														</Button>
														<Button variant="outline">
															<RefreshCw className="mr-2 h-4 w-4" />
															Sync Now
														</Button>
													</>
												) : (
													<Button className="w-full">
														Connect Integration
													</Button>
												)}
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="general" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Organization Profile</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-2">
								<Label htmlFor="org-name">
									Organization Name
								</Label>
								<Input id="org-name" defaultValue="Acme Corp" />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="admin-email">Admin Email</Label>
								<Input
									id="admin-email"
									defaultValue="admin@acme.com"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="border-destructive/50">
						<CardHeader>
							<CardTitle className="text-destructive">
								Danger Zone
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">
										Reset all data
									</div>
									<div className="text-sm text-muted-foreground">
										This will delete all history and scores.
									</div>
								</div>
								<Button variant="destructive">
									Reset Data
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="notifications" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Alert Preferences</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="text-base">
										Weekly Report
									</Label>
									<div className="text-sm text-muted-foreground">
										Receive a summary of your clutter score
										every Monday.
									</div>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="text-base">
										Critical Security Alerts
									</Label>
									<div className="text-sm text-muted-foreground">
										Immediate email when ghost access is
										detected.
									</div>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="text-base">
										Storage Limits
									</Label>
									<div className="text-sm text-muted-foreground">
										Notify when storage waste exceeds 1TB.
									</div>
								</div>
								<Switch />
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="billing" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Current Plan</CardTitle>
								<CardDescription>
									You are on the Pro Plan
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-baseline gap-2">
									<span className="text-3xl font-bold">
										$290
									</span>
									<span className="text-muted-foreground">
										/year
									</span>
								</div>
								<div className="text-sm text-muted-foreground">
									Includes 50 users and unlimited automated
									cleanups.
								</div>
								<Separator />
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Users</span>
										<span className="font-medium">
											42 / 50
										</span>
									</div>
									<div className="h-2 bg-secondary rounded-full overflow-hidden">
										<div className="h-full bg-primary w-[84%]" />
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Upgrade Plan</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Payment Method</CardTitle>
								<CardDescription>
									Manage your billing details
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-4 p-4 border rounded-lg">
									<div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
										<CreditCard className="h-6 w-6" />
									</div>
									<div>
										<div className="font-medium">
											Visa ending in 4242
										</div>
										<div className="text-sm text-muted-foreground">
											Expires 12/2026
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button variant="outline" className="w-full">
									Update Payment Method
								</Button>
							</CardFooter>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Invoice History</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[
									{
										id: "INV-2024-001",
										date: "Jan 1, 2025",
										amount: "$290.00",
										status: "Paid",
									},
									{
										id: "INV-2023-012",
										date: "Jan 1, 2024",
										amount: "$290.00",
										status: "Paid",
									},
								].map((invoice) => (
									<div
										key={invoice.id}
										className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
									>
										<div className="flex items-center gap-4">
											<div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
												<Receipt className="h-4 w-4 text-muted-foreground" />
											</div>
											<div>
												<div className="font-medium text-sm">
													{invoice.id}
												</div>
												<div className="text-xs text-muted-foreground">
													{invoice.date}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<span className="text-sm font-medium">
												{invoice.amount}
											</span>
											<Badge
												variant="outline"
												className="text-emerald-600 border-emerald-200 bg-emerald-50"
											>
												{invoice.status}
											</Badge>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
											>
												<Download className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
