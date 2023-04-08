/*
  Warnings:

  - Made the column `desc` on table `ExerciseSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ExerciseSession" ALTER COLUMN "desc" SET NOT NULL,
ALTER COLUMN "desc" SET DEFAULT '';
