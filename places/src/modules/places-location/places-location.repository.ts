import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { IPlacesLocationRepository } from './dtos/places-location-repository';
import { PlacesLocationEntity } from './places-location.entity';

@Injectable()
export class PlacesLocationRepository implements IPlacesLocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: PlacesLocationEntity): Promise<void> {
    await this.prisma.placesLocation.create({
      data: payload,
    });
  }

  async findByCoordinates(
    coordinates: number[],
  ): Promise<PlacesLocationEntity | null> {
    return await this.prisma.placesLocation.findFirst({
      where: {
        latitude: coordinates[0],
        longitude: coordinates[1],
      },
    });
  }

  async findByPlaceId(placeId: string): Promise<PlacesLocationEntity | null> {
    return await this.prisma.placesLocation.findFirst({
      where: {
        place_id: placeId,
      },
    });
  }
}
