/*
  Warnings:

  - You are about to drop the column `role` on the `ClubMembership` table. All the data in the column will be lost.
  - The `indoorClassification` column on the `RecordsSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `outdoorClassification` column on the `RecordsSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `indoorBadgeGiven` column on the `RecordsSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `outdoorBadgeGiven` column on the `RecordsSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `roundClassification` on the `Scores` table. All the data in the column will be lost.
  - Made the column `contactPhone` on table `IceDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoundType" AS ENUM ('INDOOR', 'OUTDOOR');

-- CreateEnum
CREATE TYPE "IndoorClassification" AS ENUM ('IA3', 'IA2', 'IA1', 'IB3', 'IB2', 'IMB', 'IGMB');

-- CreateEnum
CREATE TYPE "OutdoorClassification" AS ENUM ('A3', 'A2', 'A1', 'B3', 'B2', 'B1', 'MB', 'GMB', 'EMB');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MembershipRole" ADD VALUE 'COACH';
ALTER TYPE "MembershipRole" ADD VALUE 'RECORDS';

-- AlterTable
ALTER TABLE "ClubMembership" DROP COLUMN "role",
ADD COLUMN     "roles" "MembershipRole"[];

-- AlterTable
ALTER TABLE "IceDetails" ALTER COLUMN "contactPhone" SET NOT NULL,
ALTER COLUMN "relationshipType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecordsSummary" DROP COLUMN "indoorClassification",
ADD COLUMN     "indoorClassification" "IndoorClassification",
DROP COLUMN "outdoorClassification",
ADD COLUMN     "outdoorClassification" "OutdoorClassification",
DROP COLUMN "indoorBadgeGiven",
ADD COLUMN     "indoorBadgeGiven" "IndoorClassification",
DROP COLUMN "outdoorBadgeGiven",
ADD COLUMN     "outdoorBadgeGiven" "OutdoorClassification";

-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "roundClassification",
ADD COLUMN     "roundIndoorClassification" "IndoorClassification",
ADD COLUMN     "roundOutdoorClassification" "OutdoorClassification",
ADD COLUMN     "roundType" "RoundType" NOT NULL DEFAULT 'INDOOR';

-- DropEnum
DROP TYPE "Classification";
