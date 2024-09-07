/*
  Warnings:

  - You are about to drop the column `neighborhood` on the `PlacesLocation` table. All the data in the column will be lost.
  - Added the required column `neighbourhood` to the `PlacesLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlacesLocation" DROP COLUMN "neighborhood",
ADD COLUMN     "neighbourhood" TEXT NOT NULL;
