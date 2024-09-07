import { Injectable } from '@nestjs/common';
import { IPlacesTypeRepository } from './dtos/places-type-repository';
import { PlacesTypeEntity } from './places-type.entity';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class PlacesTypeRepository implements IPlacesTypeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(payload: PlacesTypeEntity): Promise<void> {
    try {
      await this.prisma.placesType.create({ data: payload });
    } catch (error) {
      throw error;
    }
  }
  async findBySlug(slug: string): Promise<PlacesTypeEntity> {
    try {
      const result = await this.prisma.placesType.findFirst({
        where: { slug },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
