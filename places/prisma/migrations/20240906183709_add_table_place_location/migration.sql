/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `PlacesType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "PlacesLocation" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "coordinates" DOUBLE PRECISION[],
    "place_id" TEXT NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,

    CONSTRAINT "PlacesLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlacesLocation_coordinates_idx" ON "PlacesLocation"("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "PlacesLocation_coordinates_key" ON "PlacesLocation"("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "PlacesType_slug_key" ON "PlacesType"("slug");
