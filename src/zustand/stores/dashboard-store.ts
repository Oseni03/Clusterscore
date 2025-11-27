import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DashboardAuditData, ScoreTrendData } from "@/types/audit";

export interface DashboardState {
	auditData: DashboardAuditData | null;
	scoreTrends: ScoreTrendData[];
	selectedTrendPeriod: "30" | "90";
	lastRefresh: Date | null;

	// Actions
	setAuditData: (data: DashboardAuditData | null) => void;
	setScoreTrends: (trends: ScoreTrendData[]) => void;
	setSelectedTrendPeriod: (period: "30" | "90") => void;
	setLastRefresh: (date: Date) => void;
	reset: () => void;
}

export const createDashboardStore = () => {
	return create<DashboardState>()(
		persist(
			(set) => ({
				auditData: null,
				scoreTrends: [],
				selectedTrendPeriod: "30",
				lastRefresh: null,

				setAuditData: (data) => set({ auditData: data }),
				setScoreTrends: (trends) => set({ scoreTrends: trends }),
				setSelectedTrendPeriod: (period) =>
					set({ selectedTrendPeriod: period }),
				setLastRefresh: (date) => set({ lastRefresh: date }),
				reset: () =>
					set({
						auditData: null,
						scoreTrends: [],
						selectedTrendPeriod: "30",
						lastRefresh: null,
					}),
			}),
			{
				name: "dashboard-store",
				partialize: (state) => ({
					selectedTrendPeriod: state.selectedTrendPeriod,
				}),
			}
		)
	);
};
