/*
  Warnings:

  - Made the column `indoorClassification` on table `RecordsSummary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outdoorClassification` on table `RecordsSummary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IndoorClassification" ADD VALUE 'IB1';
ALTER TYPE "IndoorClassification" ADD VALUE 'UNCLASSIFIED';

-- AlterEnum
ALTER TYPE "OutdoorClassification" ADD VALUE 'UNCLASSIFIED';

-- AlterTable
ALTER TABLE "RecordsSummary" ALTER COLUMN "indoorClassification" SET NOT NULL,
ALTER COLUMN "outdoorClassification" SET NOT NULL;
