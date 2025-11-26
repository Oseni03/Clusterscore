import { useState } from "react";
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
	FileText,
	Image,
	Film,
	Archive,
	Database,
	MoreHorizontal,
	Trash2,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data generator
const generateFiles = (count: number) => {
	const types = ["Document", "Image", "Video", "Archive", "Database"];
	const locations = ["Google Drive", "Dropbox", "Slack", "OneDrive"];

	return Array.from({ length: count }).map((_, i) => {
		const type = types[Math.floor(Math.random() * types.length)];
		return {
			id: i + 1,
			name: `Project_Alpha_Asset_${i + 1}.${type === "Image" ? "png" : type === "Video" ? "mp4" : "pdf"}`,
			size: `${Math.floor(Math.random() * 500 + 10)} MB`,
			type,
			location: locations[Math.floor(Math.random() * locations.length)],
			lastAccessed: `${Math.floor(Math.random() * 24 + 1)} months ago`,
			owner: `User ${Math.floor(Math.random() * 10 + 1)}`,
		};
	});
};

const allFiles = generateFiles(50);

export default function FilesPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const itemsPerPage = 10;

	const filteredFiles = allFiles.filter(
		(file) =>
			file.name.toLowerCase().includes(search.toLowerCase()) ||
			file.location.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentFiles = filteredFiles.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const getIcon = (type: string) => {
		switch (type) {
			case "Video":
				return <Film className="h-4 w-4 text-blue-500" />;
			case "Image":
				return <Image className="h-4 w-4 text-purple-500" />;
			case "Archive":
				return <Archive className="h-4 w-4 text-yellow-500" />;
			case "Database":
				return <Database className="h-4 w-4 text-green-500" />;
			default:
				return <FileText className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-display font-bold">
						File Explorer
					</h1>
					<p className="text-muted-foreground">
						Manage large and unused files across all connected apps.
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export List
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<div className="relative flex-1 md:max-w-sm">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search files..."
								className="pl-9"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setCurrentPage(1);
								}}
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
								<TableHead>Name</TableHead>
								<TableHead>Size</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Last Accessed</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentFiles.map((file) => (
								<TableRow key={file.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center">
												{getIcon(file.type)}
											</div>
											<div
												className="font-medium truncate max-w-[200px]"
												title={file.name}
											>
												{file.name}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className="font-mono text-xs"
										>
											{file.size}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{file.location}
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{file.lastAccessed}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem className="text-destructive">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete File
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Download className="mr-2 h-4 w-4" />
													Download
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{/* Pagination */}
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="text-sm text-muted-foreground">
							Showing {startIndex + 1}-
							{Math.min(
								startIndex + itemsPerPage,
								filteredFiles.length
							)}{" "}
							of {filteredFiles.length} files
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1)
									)
								}
								disabled={currentPage === totalPages}
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
