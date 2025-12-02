type LogSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "SUCCESS";

export function formatTelegramMessage(
	appName: string,
	message: string,
	severity: LogSeverity
) {
	const severityMap: Record<LogSeverity, string> = {
		INFO: "ℹ️ <b>INFO</b>",
		WARNING: "⚠️ <b>WARNING</b>",
		ERROR: "❌ <b>ERROR</b>",
		CRITICAL: "🔥 <b>CRITICAL</b>",
		SUCCESS: "✅ <b>SUCCESS</b>",
	};

	const header = severityMap[severity] ?? "ℹ️ <b>INFO</b>";

	return `
<b>🚀 ${appName}</b>
${header}

<pre>${message}</pre>
  `;
}

export async function sendTelegramMessage(text: string) {
	const BOT_TOKEN = process.env.TELEGRAM_API_TOKEN;
	const CHAT_ID = process.env.TELEGRAM_CHANNEL_ID;
	if (!BOT_TOKEN) {
		throw new Error(
			"TELEGRAM_API_TOKEN is not defined in environment variables"
		);
	}
	try {
		await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text,
				parse_mode: "HTML",
			}),
		});
	} catch (err) {
		console.error("Telegram send error:", err);
	}
}
