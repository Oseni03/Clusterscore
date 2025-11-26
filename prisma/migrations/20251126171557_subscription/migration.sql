/*
  Warnings:

  - You are about to drop the column `maxNotes` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsers` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_tenantId_fkey";

-- AlterTable
ALTER TABLE "public"."member" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "maxNotes",
DROP COLUMN "maxUsers",
DROP COLUMN "subscription",
ADD COLUMN     "polarCustomerId" TEXT;

-- DropTable
DROP TABLE "public"."Note";

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "recurringInterval" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "productId" TEXT NOT NULL,
    "discountId" TEXT,
    "checkoutId" TEXT NOT NULL,
    "customerCancellationReason" TEXT,
    "customerCancellationComment" TEXT,
    "metadata" TEXT,
    "customFieldData" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_organizationId_key" ON "public"."subscription"("organizationId");

-- AddForeignKey
ALTER TABLE "public"."subscription" ADD CONSTRAINT "subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
