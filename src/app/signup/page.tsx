"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "@/components/forms/auth-form";

const Signup = () => {
	const { user } = authClient.useSession().data || {};
	const router = useRouter();

	if (!!user) {
		router.push("/dashboard");
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<AuthForm className="w-full max-w-md" />
		</div>
	);
};

export default Signup;
