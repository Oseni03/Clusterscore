/*
  Warnings:

  - You are about to drop the column `tagetScore` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "tagetScore",
ADD COLUMN     "targetScore" INTEGER DEFAULT 75;
