import { clsx, type ClassValue } from "clsx";
import { Building2, Zap } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const SUBSCRIPTION_PLANS = [
	{
		id: "solo",
		name: "Solo",
		description: "Perfect for solopreneurs and freelancers",
		price: "$20",
		period: "/month",
		icon: Building2,
		features: ["3 users", "50 notes"],
		popular: false,
		productId: process.env.POLAR_SOLO_PLAN_ID || "",
	},
	{
		id: "entrepreneur",
		name: "Entrepreneur",
		description: "Advanced features for entrepreneurs",
		price: "$60",
		period: "/month",
		icon: Zap,
		features: ["Unlimited users", "Unlimited notes"],
		popular: true,
		productId: process.env.POLAR_ENTREPRENEUR_PLAN_ID || "",
	},
	{
		id: "multipreneur",
		name: "Multipreneur",
		description: "Advanced features for multipreneurs and serial builders",
		price: "$120",
		period: "/month",
		icon: Zap,
		features: ["Unlimited users", "Unlimited notes"],
		popular: true,
		productId: process.env.POLAR_MULTIPRENEUR_PLAN_ID || "",
	},
];

export const FREE_PLAN = SUBSCRIPTION_PLANS.at(0);

export const getPlan = (planId: string) => {
	return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
};

export const getPlanByProductId = (productId: string) => {
	return (
		SUBSCRIPTION_PLANS.find((plan) => plan.productId === productId) ||
		FREE_PLAN
	);
};
