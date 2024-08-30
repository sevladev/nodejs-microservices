import { PlacesTypeEntity } from '../places-type.entity';

export interface IPlacesTypeRepository {
  create(payload: PlacesTypeEntity): Promise<void>;
  findBySlug(slug: string): Promise<PlacesTypeEntity>;
}
