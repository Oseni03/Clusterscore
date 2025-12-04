import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ConnectorFactory } from "@/lib/connectors/factory";
import { ConnectorConfig } from "@/lib/connectors/types";
import { AuditLogStatus } from "@prisma/client";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	return withAuth(req, async (req, user) => {
		try {
			// Find file and verify ownership
			const file = await prisma.file.findFirst({
				where: {
					id,
					auditResult: {
						organizationId: user.organizationId,
					},
				},
			});

			if (!file) {
				return NextResponse.json(
					{ error: "File not found" },
					{ status: 404 }
				);
			}

			const integration = await prisma.toolIntegration.findUnique({
				where: {
					organizationId_source: {
						organizationId: user.organizationId,
						source: file.source,
					},
				},
			});

			if (!integration) {
				return NextResponse.json(
					{ error: "Integration not found for this file" },
					{ status: 404 }
				);
			}

			// Attempt to delete file from external platform
			let externalDeletionSuccess = false;
			let externalError: string | null = null;

			try {
				// Create connector configuration
				const connectorConfig: ConnectorConfig = {
					accessToken: integration.accessToken,
					refreshToken: integration.refreshToken || undefined,
					organizationId: user.organizationId,
					expiresAt: integration.expiresAt || undefined,
					// metadata:
					// 	(integration.metadata as Record<string, any>) || {},
				};

				// Create connector instance
				const connector = ConnectorFactory.create(
					file.source,
					connectorConfig
				);

				// Prepare metadata for deletion
				const fileMetadata = {
					name: file.name,
					path: file.path,
					mimeType: file.mimeType,
					// ...((file.metadata as Record<string, any>) || {}),
				};

				// Attempt deletion on external platform
				await connector.deleteFile(file.externalId!, fileMetadata);
				externalDeletionSuccess = true;

				// Update integration tokens if they were refreshed
				if (connectorConfig.accessToken !== integration.accessToken) {
					await prisma.toolIntegration.update({
						where: { id: integration.id },
						data: {
							accessToken: connectorConfig.accessToken,
							expiresAt: connectorConfig.expiresAt,
						},
					});
				}
			} catch (error) {
				console.error(
					`Failed to delete file from ${file.source}:`,
					error
				);
				externalError =
					error instanceof Error ? error.message : "Unknown error";

				// If the connector doesn't support deletion, log but continue
				if (externalError.includes("not supported")) {
					console.warn(
						`File deletion not supported for ${file.source}, proceeding with local deletion only`
					);
				} else {
					// For other errors, we might want to fail the operation
					// Uncomment the following lines to prevent local deletion if external deletion fails
					// return NextResponse.json(
					// 	{ error: `Failed to delete file from ${file.source}: ${externalError}` },
					// 	{ status: 500 }
					// );
				}
			}

			// Mark as deleted in local database (soft delete)
			await prisma.file.update({
				where: { id },
				data: {
					status: "DELETED",
					// metadata: {
					// 	...((file.metadata as Record<string, any>) || {}),
					// 	deletedAt: new Date().toISOString(),
					// 	externalDeletionSuccess,
					// 	externalError,
					// },
				},
			});

			// Log activity
			await prisma.activity.create({
				data: {
					organizationId: user.organizationId,
					userId: user.id,
					action: "file.deleted",
					metadata: {
						fileId: file.id,
						fileName: file.name,
						source: file.source,
						size: file.sizeMb,
						externalDeletionSuccess,
						externalError,
					},
				},
			});

			// Create audit log
			await prisma.auditLog.create({
				data: {
					organizationId: user.organizationId,
					userId: user.id,
					actionType: "DELETE_FILE",
					target: file.name,
					targetType: "File",
					executor: `User ${user.email}`,
					status: "SUCCESS",
					details: {
						source: file.source,
						size: file.sizeMb,
						path: file.path,
						externalDeletionSuccess,
						externalError,
					},
				},
			});

			return NextResponse.json({
				success: true,
				message: externalDeletionSuccess
					? "File deleted successfully from platform and database"
					: externalError?.includes("not supported")
						? "File marked as deleted (platform does not support automatic deletion)"
						: "File marked as deleted locally, but external deletion failed",
				externalDeletionSuccess,
				externalError,
			});
		} catch (error) {
			console.error("Failed to delete file:", error);

			// Log failed attempt
			try {
				await prisma.auditLog.create({
					data: {
						organizationId: user.organizationId,
						userId: user.id,
						actionType: "DELETE_FILE",
						target: id,
						targetType: "File",
						executor: `User ${user.email}`,
						status: "FAILURE" as AuditLogStatus,
						details: {
							error:
								error instanceof Error
									? error.message
									: "Unknown error",
						},
					},
				});
			} catch (logError) {
				console.error("Failed to create audit log:", logError);
			}

			return NextResponse.json(
				{ error: (error as Error).message || "Failed to delete file" },
				{ status: 500 }
			);
		}
	});
}
