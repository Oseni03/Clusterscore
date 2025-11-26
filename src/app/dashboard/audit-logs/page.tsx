import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Search,
	Filter,
	ShieldAlert,
	Trash2,
	UserX,
	RotateCcw,
	Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const auditLogs = [
	{
		id: 1,
		action: "Revoked Access",
		target: "sarah@skynet.com",
		targetType: "User",
		executor: "Admin (You)",
		timestamp: "2 mins ago",
		status: "Success",
		details: "Revoked Slack, Dropbox tokens",
	},
	{
		id: 2,
		action: "Deleted Files",
		target: "Marketing_Q3_Raw.zip",
		targetType: "File",
		executor: "Automated Policy",
		timestamp: "2 hours ago",
		status: "Success",
		details: "Size: 4.2GB, Age: 2 years",
	},
	{
		id: 3,
		action: "Archived Channel",
		target: "#random-ideas-2023",
		targetType: "Slack Channel",
		executor: "Admin (You)",
		timestamp: "5 hours ago",
		status: "Success",
		details: "Last active: 14 months ago",
	},
	{
		id: 4,
		action: "Failed Revocation",
		target: "guest_user_12@gmail.com",
		targetType: "User",
		executor: "Automated Policy",
		timestamp: "1 day ago",
		status: "Failed",
		details: "API Error: Insufficient permissions",
	},
	{
		id: 5,
		action: "Deleted Files",
		target: "Old_Backup.sql",
		targetType: "File",
		executor: "Admin (You)",
		timestamp: "1 day ago",
		status: "Success",
		details: "Size: 1.2GB",
	},
];

export default function AuditLogsPage() {
	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-display font-bold">
						Audit Logs
					</h1>
					<p className="text-muted-foreground">
						Track every cleanup action and security event.
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export CSV
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<div className="relative flex-1 md:max-w-sm">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search logs..."
								className="pl-9"
							/>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="icon">
								<Filter className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Action</TableHead>
								<TableHead>Target</TableHead>
								<TableHead>Executor</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">
									Details
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{auditLogs.map((log) => (
								<TableRow key={log.id}>
									<TableCell>
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"h-8 w-8 rounded-full flex items-center justify-center",
													log.action.includes(
														"Delete"
													)
														? "bg-red-100 text-red-600"
														: log.action.includes(
																	"Revoke"
															  )
															? "bg-orange-100 text-orange-600"
															: "bg-blue-100 text-blue-600"
												)}
											>
												{log.action.includes(
													"Delete"
												) ? (
													<Trash2 className="h-4 w-4" />
												) : log.action.includes(
														"Revoke"
												  ) ? (
													<UserX className="h-4 w-4" />
												) : (
													<ShieldAlert className="h-4 w-4" />
												)}
											</div>
											<span className="font-medium">
												{log.action}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium text-sm">
												{log.target}
											</div>
											<div className="text-xs text-muted-foreground">
												{log.targetType}
											</div>
										</div>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{log.executor}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{log.timestamp}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												log.status === "Success"
													? "outline"
													: "destructive"
											}
											className={
												log.status === "Success"
													? "text-emerald-600 border-emerald-200 bg-emerald-50"
													: ""
											}
										>
											{log.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<span className="text-xs text-muted-foreground self-center mr-2">
												{log.details}
											</span>
											{log.status === "Success" && (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 text-xs"
												>
													<RotateCcw className="mr-1 h-3 w-3" />
													Undo
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
