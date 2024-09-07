/*
  Warnings:

  - You are about to drop the column `coordinates` on the `PlacesLocation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[place_id]` on the table `PlacesLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[latitude,longitude]` on the table `PlacesLocation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `PlacesLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `PlacesLocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlacesLocation_coordinates_idx";

-- DropIndex
DROP INDEX "PlacesLocation_coordinates_place_id_key";

-- AlterTable
ALTER TABLE "PlacesLocation" DROP COLUMN "coordinates",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "PlacesLocation_place_id_idx" ON "PlacesLocation"("place_id");

-- CreateIndex
CREATE INDEX "PlacesLocation_latitude_longitude_idx" ON "PlacesLocation"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "PlacesLocation_place_id_key" ON "PlacesLocation"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlacesLocation_latitude_longitude_key" ON "PlacesLocation"("latitude", "longitude");
