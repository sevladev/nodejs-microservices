import { IPlacesTypeRepository } from './dtos/places-type-repository';
import { PlacesTypeEntity } from './places-type.entity';

const placesType: PlacesTypeEntity[] = [];

export class PlacesTypeRepositoryInMemory implements IPlacesTypeRepository {
  async create(payload: PlacesTypeEntity): Promise<void> {
    placesType.push(payload);
  }

  async findBySlug(slug: string): Promise<PlacesTypeEntity> {
    return placesType.find((f) => f.slug === slug);
  }
}
