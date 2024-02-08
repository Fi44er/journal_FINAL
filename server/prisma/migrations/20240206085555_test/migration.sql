/*
  Warnings:

  - You are about to drop the column `letterClass` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `numberClass` on the `class` table. All the data in the column will be lost.
  - Added the required column `letter_class` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_class` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class" DROP COLUMN "letterClass",
DROP COLUMN "numberClass",
ADD COLUMN     "letter_class" TEXT NOT NULL,
ADD COLUMN     "number_class" INTEGER NOT NULL;
