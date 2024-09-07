/*
  Warnings:

  - A unique constraint covering the columns `[coordinates,place_id]` on the table `PlacesLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PlacesLocation_coordinates_key";

-- CreateIndex
CREATE UNIQUE INDEX "PlacesLocation_coordinates_place_id_key" ON "PlacesLocation"("coordinates", "place_id");
