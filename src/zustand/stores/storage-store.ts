import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StorageStats {
	totalUsedGb: number;
	totalQuotaGb: number;
	wastedStorageGb: number;
	estimatedMonthlyCost: number;
	largestWaster: {
		type: string;
		sizeGb: number;
		location: string;
	};
}

export interface StorageDistribution {
	name: string;
	value: number;
	sizeGb: number;
	color: string;
}

export interface StorageState {
	stats: StorageStats | null;
	distribution: StorageDistribution[];
	lastUpdated: Date | null;

	// Actions
	setStats: (stats: StorageStats) => void;
	setDistribution: (distribution: StorageDistribution[]) => void;
	setLastUpdated: (date: Date) => void;
	reset: () => void;
}

export const createStorageStore = () => {
	return create<StorageState>()(
		persist(
			(set) => ({
				stats: null,
				distribution: [],
				lastUpdated: null,

				setStats: (stats) => set({ stats }),
				setDistribution: (distribution) => set({ distribution }),
				setLastUpdated: (date) => set({ lastUpdated: date }),
				reset: () =>
					set({
						stats: null,
						distribution: [],
						lastUpdated: null,
					}),
			}),
			{
				name: "storage-store",
			}
		)
	);
};
