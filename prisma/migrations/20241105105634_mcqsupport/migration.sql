/*
  Warnings:

  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_createdBy_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdBy";

-- DropTable
DROP TABLE "Admin";

-- DropEnum
DROP TYPE "QuestionType";
