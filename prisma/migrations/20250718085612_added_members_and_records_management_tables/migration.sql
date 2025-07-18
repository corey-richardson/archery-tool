/*
  Warnings:

  - You are about to drop the column `accountType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Bowstyle" AS ENUM ('BAREBOW', 'RECURVE', 'COMPOUND', 'LONGBOW', 'TRADITIONAL');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('PARENT', 'GUARDIAN', 'SPOUSE', 'SIBLING', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "Classification" AS ENUM ('IA3', 'IA2', 'IA1', 'IB3', 'IB2', 'IMB', 'IGMB', 'A3', 'A2', 'A1', 'B3', 'B2', 'B1', 'MB', 'GMB', 'EMB');

-- CreateEnum
CREATE TYPE "CompetitionLevel" AS ENUM ('PRACTICE', 'CLUB_EVENT', 'OPEN_COMPETITION', 'RECORDSTATUS_COMPETITION');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountType",
DROP COLUMN "role",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultBowstyle" "Bowstyle",
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "sex" "Sex",
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "yearOfBirth" INTEGER;

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "adminUserId" TEXT,

    CONSTRAINT "ClubMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IceDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "relationshipType" "RelationshipType" NOT NULL,

    CONSTRAINT "IceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordsSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indoorClassification" "Classification",
    "outdoorClassification" "Classification",
    "indoorBadgeGiven" "Classification",
    "outdoorBadgeGiven" "Classification",
    "indoorHandicap" INTEGER,
    "outdoorHandicap" INTEGER,

    CONSTRAINT "RecordsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "dateShot" TIMESTAMP(3) NOT NULL,
    "roundName" TEXT NOT NULL,
    "bowstyle" "Bowstyle" NOT NULL,
    "score" INTEGER NOT NULL,
    "xs" INTEGER,
    "tens" INTEGER,
    "nines" INTEGER,
    "hits" INTEGER,
    "competitionLevel" "CompetitionLevel" NOT NULL,
    "notes" TEXT,
    "roundClassification" "Classification",
    "roundHandicap" INTEGER,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMembership_userId_clubId_key" ON "ClubMembership"("userId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "RecordsSummary_userId_key" ON "RecordsSummary"("userId");

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IceDetails" ADD CONSTRAINT "IceDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordsSummary" ADD CONSTRAINT "RecordsSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
