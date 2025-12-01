"use server";

import { prisma } from "@/lib/prisma";
import { FREE_PLAN } from "@/lib/utils";

export async function createFreeSubscription(organizationId: string) {
	const freePlan = FREE_PLAN;
	if (!freePlan) throw new Error("Free plan not found in subscription plans");

	await createSubscription({
		organizationId,
		productId: freePlan.productId,
		amount: 0,
		currency: "USD",
		recurringInterval: "yearly",
	});
}

export async function createSubscription(opts: {
	organizationId: string;
	productId: string;
	amount: number;
	currency: string;
	recurringInterval: string;
	trialDays?: number;
}) {
	const now = new Date();
	const currentPeriodEnd = new Date(now);

	if (opts.trialDays && opts.trialDays > 0) {
		currentPeriodEnd.setDate(currentPeriodEnd.getDate() + opts.trialDays);
	} else {
		// default to 1 year if no trial specified for free plan
		currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
	}

	await prisma.subscription.create({
		data: {
			organizationId: opts.organizationId,
			status: "active",
			amount: opts.amount,
			currency: opts.currency,
			recurringInterval: opts.recurringInterval,
			currentPeriodStart: now,
			currentPeriodEnd,
			cancelAtPeriodEnd: false,
			startedAt: now,
			customerId: `manual_${opts.organizationId}`,
			productId: opts.productId,
			checkoutId: `manual_${opts.organizationId}`,
			metadata: opts.trialDays
				? JSON.stringify({ trial: true, trialDays: opts.trialDays })
				: undefined,
			createdAt: now,
		},
	});
}
