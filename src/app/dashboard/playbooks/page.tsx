"use client";

import { useState } from "react";
import { PlaybookCard } from "@/components/playbook-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RefreshCw } from "lucide-react";

const allPlaybooks = [
	{
		id: 1,
		title: "Revoke 12 Ex-Employee Access Tokens",
		description:
			"Found 12 users who are disabled in Okta but still have active tokens in Slack and Dropbox.",
		impact: "Critical Risk",
		impactType: "security" as const,
		source: "slack" as const,
		itemsCount: 12,
	},
	{
		id: 2,
		title: "Archive 48 Stale Channels",
		description:
			"These channels haven't had a message in over 12 months. Archiving improves search relevance.",
		impact: "Efficiency",
		impactType: "efficiency" as const,
		source: "slack" as const,
		itemsCount: 48,
	},
	{
		id: 3,
		title: "Delete 142GB Duplicate Files",
		description:
			"Exact duplicates found across Google Drive and Dropbox shared folders.",
		impact: "$1,200/yr saved",
		impactType: "savings" as const,
		source: "google" as const,
		itemsCount: 843,
	},
	{
		id: 4,
		title: "Remove Unused Notion Guests",
		description:
			"24 guest accounts have full edit access but haven't logged in for 90 days.",
		impact: "Security Risk",
		impactType: "security" as const,
		source: "notion" as const,
		itemsCount: 24,
	},
	{
		id: 5,
		title: "Archive 205 Stale Notion Pages",
		description:
			"Pages with 0 views in 18 months. Archiving helps team find relevant docs faster.",
		impact: "Efficiency",
		impactType: "efficiency" as const,
		source: "notion" as const,
		itemsCount: 205,
	},
	{
		id: 6,
		title: "Delete 45 Unused Figma Drafts",
		description: "Draft files created > 1 year ago with no edits.",
		impact: "Efficiency",
		impactType: "efficiency" as const,
		source: "dropbox" as const, // Using dropbox icon for generic file
		itemsCount: 45,
	},
];

export default function PlaybooksPage() {
	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState("all");

	const filteredPlaybooks = allPlaybooks.filter((pb) => {
		const matchesSearch = pb.title
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesTab = activeTab === "all" || pb.impactType === activeTab;
		return matchesSearch && matchesTab;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-display font-bold">
						Cleanup Playbooks
					</h1>
					<p className="text-muted-foreground">
						One-click actions to improve your digital hygiene.
					</p>
				</div>
				<Button>
					<RefreshCw className="mr-2 h-4 w-4" />
					Run New Audit
				</Button>
			</div>

			<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
				<Tabs
					defaultValue="all"
					className="w-full md:w-auto"
					onValueChange={setActiveTab}
				>
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="security">Security</TabsTrigger>
						<TabsTrigger value="savings">Savings</TabsTrigger>
						<TabsTrigger value="efficiency">Efficiency</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="flex w-full md:w-auto gap-2">
					<div className="relative flex-1 md:w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Filter playbooks..."
							className="pl-9"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<Button variant="outline" size="icon">
						<Filter className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-6 mt-6">
				{filteredPlaybooks.length > 0 ? (
					filteredPlaybooks.map((playbook) => (
						<PlaybookCard
							key={playbook.id}
							title={playbook.title}
							description={playbook.description}
							impact={playbook.impact}
							impactType={playbook.impactType}
							source={playbook.source}
							itemsCount={playbook.itemsCount}
						/>
					))
				) : (
					<div className="col-span-2 text-center py-20 text-muted-foreground">
						No playbooks found matching your filters.
					</div>
				)}
			</div>
		</div>
	);
}
