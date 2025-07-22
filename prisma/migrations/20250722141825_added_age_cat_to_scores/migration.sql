-- CreateEnum
CREATE TYPE "AgeCategories" AS ENUM ('UNDER_12', 'UNDER_14', 'UNDER_15', 'UNDER_16', 'UNDER_18', 'UNDER_21', 'SENIOR', 'OVER_FIFTY');

-- AlterTable
ALTER TABLE "Scores" ADD COLUMN     "ageCategory" "AgeCategories" NOT NULL DEFAULT 'SENIOR';
